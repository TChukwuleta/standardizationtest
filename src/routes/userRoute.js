const express = require('express')
const router = express.Router()
const UserController = require('../controllers/userController')
const { validateAdmin } = require('../middleware/auth')

router.get('/', (req, res) => {
    res.status(200).json({ "message": "Welcome to the User routes" })
})

router.post('/register', validateAdmin, UserController.userRegister)
router.post('/login', UserController.loginUser)
router.post('/deposit', validateAdmin, UserController.deposit )
router.post('/withdraw', validateAdmin, UserController.withdraw )
router.post('/transfer', validateAdmin, UserController.transfer )
router.get('/transactionlist', validateAdmin, UserController.transactionlist )


module.exports = router