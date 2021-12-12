const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

const validateAdmin = (req, res, next) => {
    const token = req.get("Authorization")
    if(token){
        jwt.verify(token.split(' ')[1], `${process.env.SecretKey}`, async (err, decoded) => {
            if(err){
                return res.status(400).json({ message: "Unauthorized" })
            }
            else {
                req.user = decoded
                next()
            }
        })
    }
    else {
        return res.status(400).json({ message: "Unauthorized" })
    }
}

module.exports = {
    validateAdmin
}