const Admin = require('../models/adminProfile')
const User = require('../models/userProfile')
const Joi = require('joi')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')


// ADMIN REGISTRATION VALIDATION SCHEMA
const registerSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    password: Joi.string().min(8).required(),
    email: Joi.string().email().required()
})

// ADMIN LOGIN VALIDATION SCHEMA
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

// REGISTER ADMIN
const registerAdmin = async (req, res) => {
    // validate the request payload
    const { error } = registerSchema.validate(req.body)
    if(error)
    {
        return res.status(400).send(error.details[0].message)
    }
    // Check if an identical admin account exist
    const adminExist = await Admin.findOne({ email: req.body.email })
    if(adminExist){
        return res.status(400).json({ "message": "An admin with that detail already exist" })
    }
    // hash password and create account
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(req.body.password, salt)
    await Admin.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashPassword,
        transactionHistory: [],
        accountNo: Math.floor(1000000000 + Math.random() * 9000000000),
        users: []
    })
    return res.status(201).json({ message: "Admin account has been created successfully "})
}


// ADMIN LOGIN
const loginAdmin = async(req, res) => {
    // validate the request payload
    const { error } = loginSchema.validate(req.body)
    if(error) {
        return res.status(400).send(error.details[0].message)
    }
    // check if admin user doesn't exist
    const admin = await Admin.findOne({ email: req.body.email })
    if(!admin){
        return res.status(400).json({ message: "Invalid Email or password" })
    }
    // Validate the saved hashed password with the one the user passes
    const validatePassword = await bcrypt.compare(req.body.password, admin.password)
    if(!validatePassword){
        return res.status(400).json({ message: "Invalid Email or password "})
    }
    const signature = await createToken({
        _id: admin._id,
        email: admin.email
    })
    return res.status(201).json({ signature: signature })
}

// REVERSE TRANSACTIONS (TRANSFER)
const reverseTransaction = async (req, res) => {
    const person = req.user
    if(person){
        const admin = await Admin.findById(person._id)
        if(admin){
            const { transactionId, senderAcctNo } = req.body
            const user = await User.findOne({ accountNo: senderAcctNo })
            if(!user){
                return res.status(200).json({ message: "User not found" })
            }
            const findTxn = user.transactionHistory.find(e => e.TxnId == transactionId)
            if(findTxn){
                function getKeyByValue(object, value) {
                    console.log(Object.keys(object).find(key => object[key] === value));

                }
                
                const receiverNo = getKeyByValue(findTxn, "ReceiverAcctNo")
                console.log(receiverNo)
                return res.send(findTxn)
                // const receiverNo = findTxn.ReceiverAcctNo
                // const amount = findTxn.Amount
                // return res.send(receiverNo)

                // const receiver = await User.findOne({ accountNo: receiverNo })

                // if(receiver){
                //     user.balance += amount
                //     receiver.balance -= amount

                //     await user.save()
                //     await receiver.save()

                //     return res.status(201).json({ message: "Transaction reversal was successful" })
                // }
                // return res.status(400).json({ message: "Invalid Transaction" })
            }
            return res.status(400).json({ message: "Invalid transaction" })
        }
    }
    return res.status(400).json({ message: "Unauthorized" })
}

// DELETE USER
const deleteUser = async (req, res) => {
    const person = req.user
    if(person){
        const admin = await Admin.findById(person._id)
        if(admin){
            const { acctNo } = req.body
           const deleteUser =  await User.findOneAndDelete({ accountNo: acctNo })
           if(deleteUser){
                return res.status(201).json({ message: "User deleted successfully" })
           }
           return res.status(201).json({ message: "User deleted successfully" })
        }
        return res.status(400).json({ message: "Unauthorized" })
    }
}

// DISABLE USER
const disableUser = async (req, res) => {
    const user = req.user
    if(user){
        const admin = await Admin.findById(user._id)
        if(admin){
            const { acctNo } = req.body
            const normalUser = await User.findOne({ accountNo: acctNo })
            if(!normalUser){
                return res.status(400).json({ message: "User doesn't exist" })
            }
            if(normalUser.isActive == false){
                return res.status(200).json({ message: "User account already disabled" })
            }
            normalUser.isActive = !normalUser.isActive
            await normalUser.save()
            return res.status(200).json({ message: "User disabled successfully" })
        }
        return res.status(400).json({ message: "Unauthorized" })
    }
}

module.exports = {
    registerAdmin,
    loginAdmin,
    disableUser,
    deleteUser,
    reverseTransaction
}