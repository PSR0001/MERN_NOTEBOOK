// require Dotenv file
require('dotenv').config()

// requireJWT token for user authentication
const jwt = require('jsonwebtoken');

const FetchUser = (req, res, next) => {
    // get user id from auth-token
    const token = req.header('auth-token')
    if (!token) {
        res.status(401).json({ error: "user ERROR!" })
    }
    try {
        const data = jwt.verify(token, process.env.JWT_STRING)
        req.user = data.user;

    }
    catch (error) {
        res.status(401).json({ error: "user ERROR!" })
    }

    next()
}

module.exports = FetchUser