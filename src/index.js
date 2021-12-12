const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const adminRoute = require('./routes/adminRoute')
const userRoute = require('./routes/userRoute')
dotenv.config()

const app = express()
const path = require('path')

// mongoose.connect(`${process.env.MONGO_URL}`, { useNewUrlParser: true })
// .then(() => {
//     console.log('Leggo')
// })
// .catch((e) => { 
//     console.log(e)
// })
const uri = 'mongodb://localhost/standardizationtest'
mongoose.connect(uri, { useNewUrlParser: true })
.then(() => {
    console.log('Leggo')
})
.catch((e) => {
    console.log(e)
}) 

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use('/admin', adminRoute)
app.use('/user', userRoute)

app.get('/', (req, res) => {
    res.send("Hello.. Welcome aboard")
})

const port = process.env.PORT || 1005
app.listen(port, () => {
    console.log(`App is up and running on port ${port}`)
})