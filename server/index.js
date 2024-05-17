const express = require('express')

const cors = require('cors')    //Cross-origin Resource Sharing is browser mechanism necessary to allow controlled access to resources outside a given domain

require('dotenv').config()  //necessary to use .env where we store important information we don't want to share

const bcrypt = require('bcryptjs')  //used to encrypt sensible data such as passwords

const jwt = require('jsonwebtoken') //Json Web Token is a standard that defines a way of securely transmit data between parties as JSON

const cookieParser = require('cookie-parser')   //module used to read cookies

const imageDownloader = require('image-downloader') //image downloader library

//middleware used to 'put' files sent to server to the uploads directory
const multer = require('multer')
const photosMiddleware = multer({ dest: 'uploads/' })

const authenticateToken = require('./middleware/auth')

const fs = require('fs')    //file system

const placesRoutes = require('./routes/placeRoutes')

//These are necessary for the database. the first one allows us to use mongoose (connect to the db, send data, receive data etc)
//the others are the models used to define the structure of the documents in our db
const { default: mongoose } = require('mongoose')
const UserModel = require('./models/User')
const PlaceModel = require('./models/Place')
const BookingModel = require('./models/Booking')

const jwtSecret = process.env.JWT_SECRET

const app = express()

//we're telling Node to use a middleware to parse incoming requests with JSON payloads. the middleware then populates the req.body with the
//parsed data to be more easily accessible
app.use(express.json())
app.use(cookieParser())

//we're creating a virtual path prefix to be able to serve files in the path specified in the static method as if we were accessing the page uploads
app.use('/uploads', express.static(__dirname + '/uploads'))

app.use('/place', placesRoutes)

//salt is a random piece of data of x lenght (x is the parameter) that is used to create a unique HASH code to encrypt
//We'll be using JWT to maintain sessions
const bCryptSalt = bcrypt.genSaltSync(10)

//we're telling our web app to allow incoming requests from the port 5173
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173',
}))

//connection to the db
mongoose.connect(process.env.MONGO_URL)

//API ENDPOINTS
/* POST REQUESTS */
app.post('/register', async (req, res) => {
    const { name, email, password } = req.body
    try {
        const user = await UserModel.create({
            name,
            email,
            password: bcrypt.hashSync(password, bCryptSalt)
        })
        res.json(user)
    } catch (e) {
        res.status(422).json(e)
    }
})

app.post('/login', async (req, res) => {
    const { email, password } = req.body
    const userDoc = await UserModel.findOne({ email })
    if (userDoc) {
        const passOk = bcrypt.compareSync(password, userDoc.password)
        if (passOk) {
            jwt.sign({ email: userDoc.email, id: userDoc._id }, jwtSecret, {}, (err, token) => {
                if (err) throw err
                res.cookie('token', token, { httpOnly: true }).json(userDoc)
            })
        }
        else
            res.status(422).json('Wrong password')
    }
    else
        res.status(422).json('Not found')
})

app.post('/logout', (req, res) => {
    res.cookie('token', '').json(true)
})

app.post('/upload-by-link', async (req, res) => {
    const { link } = req.body
    const newName = 'photo' + Date.now() + '.jpg'
    try {
        //there's some sites that when you do 'copy image link' return weird link. these DON'T work
        await imageDownloader.image({
            url: link,
            dest: __dirname + '/uploads/' + newName,
        })
        res.status(201).json(newName)
    } catch (e) {
        res.status(422).json({ error: 'Failed to download image' })
    }
})

app.post('/upload', photosMiddleware.array('photos', 100), async (req, res) => {
    const uploadedFiles = []
    for (let i = 0; i < req.files.length; i++) {
        //path and originalname can be found in req thanks to the middlware
        const { path, originalname } = req.files[i]
        const parts = originalname.split('.')
        const extension = parts[parts.length - 1]
        const newPath = path + '.' + extension
        fs.renameSync(path, newPath)
        uploadedFiles.push(newPath.replace('uploads', '').slice(1))
    }
    res.json(uploadedFiles)
})

app.post('/booking', authenticateToken, async (req, res) => {
    const userData = req.data
    const { place, checkIn, checkOut, numberOfGuests, name, phone, price } = req.body
    try {
        const doc = await BookingModel.create({
            place, checkIn, checkOut,
            numberOfGuests, name, phone,
            price, user: userData.id
        })
        res.status(201).json(doc)
    } catch (error) {
        res.status(500).json(error)
    }
})

/* GET REQUESTS */
app.get('/profile', authenticateToken, async (req, res) => {
    const data = req.data
    try {
        const { name, email, _id } = await UserModel.findById(data.id)
        res.status(200).json({ name, email, _id })
    } catch (error) {
        res.status(500).json(error)
    }
})

app.get('/user-places', authenticateToken, async (req, res) => {
    const { id } = req.data
    try {
        res.status(200).json(await PlaceModel.find({ owner: id }))
    } catch (error) {
        res.status(500).json(error)
    }
})

app.get('/places', async (req, res) => {
    res.json(await PlaceModel.find()).status(200)
})

app.get('/bookings', authenticateToken, async (req, res) => {
    const data = req.data
    try {
        res.status(200).json(await BookingModel.find({ user: data.id }).populate('place')) //populate will fill the 'place' field with data taken from the PlaceModel that corresponds with the place id
    } catch (error) {
        res.status(500).json(error)
    }
})

app.listen(4000)