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
    transactionHistory: [{
        type: String
    }],
    users: [{
        type: schema.Types.ObjectId,
        ref: 'user'
    }]
}, {
    timestamps: true
})

const adminProfile = mongoose.model('admin', profileSchema)
module.exports = adminProfile