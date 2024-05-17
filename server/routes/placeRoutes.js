const express = require('express')
const authenticateToken = require('../middleware/auth')
const router = express.Router()
const PlaceModel = require('../models/Place')

router.put('/', authenticateToken, async (req, res) => {
    const {
        id,
        title,
        address,
        photos,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
        price
    } = req.body
    const data = req.data
    try {
        const placeDoc = await PlaceModel.findById(id)
        if (data.id === placeDoc.owner.toString()) {
            placeDoc.set({
                title,
                address,
                description,
                perks,
                photos,
                extraInfo,
                checkIn,
                checkOut,
                maxGuests,
                price
            })
            await placeDoc.save()
            res.json('ok').status(200)
        }
    } catch (error) {
        res.status(500).json(error)
    }
    /*const { token } = req.cookies
    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, userData) => {
        if (err) throw err
        const placeDoc = await PlaceModel.findById(id)
        if (userData.id === placeDoc.owner.toString()) {
            placeDoc.set({
                title,
                address,
                description,
                perks,
                photos,
                extraInfo,
                checkIn,
                checkOut,
                maxGuests,
                price
            })
            await placeDoc.save()
            res.json('ok')
        }
    })*/
})

router.post('/', authenticateToken, async (req, res) => {
    const { title, address, photos, description, perks, extraInfo, checkIn, checkOut, maxGuests, price } = req.body
    const data = req.data
    try {
        const placeDoc = await PlaceModel.create({
            owner: data.id, title, address,
            description, perks, photos, extraInfo,
            checkIn, checkOut, maxGuests,
            price
        })
        res.status(201).json(placeDoc)
    } catch (error) {
        res.status(500).json(error)
    }
})

router.get('/:id', async (req, res) => {
    const { id } = req.params
    res.json(await PlaceModel.findById(id)).status(200)
})

module.exports = router