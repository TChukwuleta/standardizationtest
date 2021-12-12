const express = require('express')
const router = express.Router()
const AdminController = require('../controllers/adminController')
const { validateAdmin } = require('../middleware/auth')

router.get('/', (req, res) => {
    res.status(200).json({ "message": "Welcome to the Admin routes" })
})

router.post('/register', AdminController.registerAdmin)
router.post('/login', AdminController.loginAdmin)
router.post('/reverse', validateAdmin, AdminController.reverseTransaction)
router.post('/deleteuser', validateAdmin, AdminController.deleteUser)
router.post('/disable', validateAdmin, AdminController.disableUser)

module.exports = router 