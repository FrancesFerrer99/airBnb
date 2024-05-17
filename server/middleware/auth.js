const jwt = require('jsonwebtoken')
require('dotenv').config()
const jwtSecret = process.env.JWT_SECRET

function authenticateToken(req, res, next) {
    const token = req.cookies.token
    if (token == null) {
        return res.status(401).json(({ error: 'Unauthorized' }))
    }

    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) return res.status(403).json({ error: 'Forbidden' })
        req.data = userData
        next()
    })
}

module.exports = authenticateToken