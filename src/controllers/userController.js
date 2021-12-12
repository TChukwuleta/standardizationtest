const User = require('../models/userProfile')
const Admin = require('../models/adminProfile')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const Joi = require('joi')

// VALIDATE USER REGISTRATION PAYLOAD
const registerSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required()
})

//  VALiDATE USER LOGIN PAYLOAD
const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required()
})

// TOKEN
const createToken = async (payload) => {
    return jwt.sign(payload, `${process.env.SecretKey}`, {
        expiresIn: 60 * 60
    })
}

// TRANSACTION MESSAGE
const transactionMessage = (alertType, amount, balance, phrase) => {
    return `${alertType}: ${amount} ${phrase}. Current Balance: ${balance}`
}

// USER REGISTRATION WITH ADMIN ALLOWANCE (ADMIN CAN ADD USER)
const userRegister = async (req, res) => {
    const user = req.user
    // Check if admin authenticates the process
    if(user){
        const admin = await Admin.findById(user._id)
        if(admin){
            // validate the request payload
            const { error } = registerSchema.validate(req.body)
            if(error){
                return res.status(400).send(error.details[0].message)
            }
            // Check if an identical admin account exist
            const userExist  = await User.findOne({ email: req.body.email })
            if(userExist){
                return res.status(400).json({ message: "User already exist" })
            }
            // hash password and create account
            const salt = await bcrypt.genSalt(10)
            const hashPassword = await bcrypt.hash(req.body.password, salt)
            const newUser = await User.create({
                adminId: admin._id,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email, 
                password: hashPassword,
                accountNo: Math.floor(1000000000 + Math.random() * 9000000000),
                transactionHistory: []
            })
            // Add the newly created user to an array in the admin
            admin.users.push(newUser)
            await admin.save()
            return res.json({ message: "User created successfully" })
        }
        return res.status(400).json({ message: "Unauthorized" })
    }
}

//USER LOGIN
const loginUser = async (req, res) => {
    // validate the request payload
    const { error } = loginSchema.validate(req.body)
    if(error){
        return res.status(400).send(error.details[0].message)
    }
    // Find if the user payload exist in our database
    const user = await User.findOne({ email: req.body.email })
    if(!user){
        return res.status(400).json({ message: "Invalid email and password "})
    }
    // Validate the password and ensure it matches with the one in the DM
    const validatePassword = await bcrypt.compare(req.body.password, user.password)
    if(!validatePassword){
        return res.status(400).json({ message: "Invalid emaill and password" })
    }
    const signature = await createToken({
        _id: user._id,
        email: user.email
    })
    return res.status(201).json({ signature: signature })
}


// USER CAN DEPOSIT MONEY
const deposit = async (req, res) => {
    const person = req.user
    if(person){
        const authPerson = await User.findById(person._id)
        if(authPerson){
            const { amount, acctNo } = req.body
            const user = await User.findOne({ accountNo: acctNo })
            if(!user){
                return res.status(400).json({ message: "Invalid account number specified" })
            }
            user.balance += amount
            TxnId = Math.floor(Math.random() * 8999) + 1000
            let transactionItem = { TxnId, Amount: amount, TxnType: 'CR', TxnDate: new Date(), ReceiverNo: user.accountNo  }
            user.transactionHistory.push(transactionItem)
            
            await user.save()
            return res.status(201).json({ message: transactionMessage('CR', amount, user.balance, 'has been successfully credited to your account') })
        }
        return res.status(400).json({ message: "Unauthorized" })
    }
}

// USER CAN WITHDRAW MONEY
const withdraw = async (req, res) => {
    const person = req.user
    if(person){
        const authPerson = await User.findById(person._id)
        if(authPerson){
            const { amount, acctNo } = req.body
            const user = await User.findOne({ accountNo: acctNo })
            if(!user){
                return res.status(400).json({ message: "Invalid account details" })
            }
            if(amount > user.balance){
                return res.status(400).json({ message: "Oppss...Insufficient funds" })
            }
            user.balance -= amount
            TxnId = Math.floor(Math.random() * 8999) + 1000
            let transactionItem = { TxnId, Amount: amount, TxnType: 'DR', TxnDate: new Date(), ReceiverNo: user.accountNo }
            user.transactionHistory.push(transactionItem)
            await user.save()
            return res.status(201).json({ message: transactionMessage('DR', amount, user.balance, 'has been successfully debited from your account') })
        }
        return res.status(400).json({ message: "Unauthorized" }) 
    }
}

// TRANSFER FUNDS TO OTHER USER 
const transfer = async (req, res) => {
    const person = req.user
    if(person){
        const authPerson = await User.findById(person._id)
        if(authPerson){
            const { amount, acctNo } = req.body
            const user = await User.findOne({ accountNo: acctNo })
            if(!user){
                return res.status(400).json({ message: "Invalid account details" })
            }
            if(amount > authPerson.balance){
                return res.status(400).json({ message: "Opps...Insufficient funds" })
            }
            authPerson.balance -= amount
            user.balance += amount
            TxnId = Math.floor(Math.random() * 8999) + 1000
            // Transaction receipt for both the receiver and sender of this transaction
            let sTransactionItem = { TxnId, Amount: amount, TxnType: 'DR', ReceiverNo: user.accountNo, TxnDate: new Date() }
            let cTransactionItem = { TxnId, Amount: amount, TxnType: 'CR', SenderNo: authPerson.accountNo, TxnDate: new Date() }
            authPerson.transactionHistory.push(sTransactionItem)
            user.transactionHistory.push(cTransactionItem)
            // Save details to both parties
            await authPerson.save()
            await user.save()
            return res.status(201).json({ message: transactionMessage('DR', amount, authPerson.balance, 'has been successfully debited from your account') })
        }
        return res.status(400).json({ message: "Unauthorized" })
    }
}

// LIST OF ALL TRANSACTIONS
const transactionlist = async (req, res) => {
    const person = req.user
    if(person){
        const { acctNo } = req.body
        const user = await User.findOne({ accountNo: acctNo })
        if(!user){
            return res.status(400).json({ message: "User does not exist" })
        }
        const allTransactions = user.transactionHistory
        return res.status(200).json({ message: allTransactions })
    }
    return res.status(400).json({ message: "Unauthorized" })
}

module.exports = {
    loginUser,
    userRegister,
    deposit,
    withdraw,
    transfer,
    transactionlist
}