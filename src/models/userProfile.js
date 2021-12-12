const mongoose = require('mongoose')
const schema = mongoose.Schema

const profileSchema = new schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    accountNo: {
        type: Number
    },
    balance: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    transactionHistory: [{
        TxnId: {
            type: Number
        },
        Amount: {
            type: Number
        },
        TxnType: {
            type: String
        },
        TxnDate: {
            type: Date
        },
        SenderNo: {
            type: Number
        },
        ReceiverNo: {
            type: Number
        }
    }]
}, {
    timestamps: true
})

const userProfile = mongoose.model('user', profileSchema)
module.exports = userProfile