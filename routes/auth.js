const express = require('express')
const router = express.Router()
const User = require('../models/User')
const { body, validationResult } = require('express-validator');
// require bcryptJS
const bcrypt = require('bcryptjs');

// Create a User Using: POST /api/auth/createuser No log in require
router.post('/createuser', [
    body('name', 'Enter Your Name!').isLength({ min: 3 }),
    // username must be an email
    body('email', 'Enter a Valid Email!').isEmail(),
    // password must be at least 5 chars long
    body('password', 'Your Password Atleast minimun 5 in Character').isLength({ min: 5 }),
], async (req, res) => {
    try {
        // if the user is not valid so return bad request 
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // matching the email in our database email
        let user = await User.findOne({ email: req.body.email })
        if (user) {
            return res.status(400).json({ error: "Sorry a user with this Email already exists!" })
        }

        const salt = await bcrypt.genSalt(10)
        const secretPassword = await bcrypt.hash(req.body.password, salt)

        // when all ok create a user
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secretPassword,
        })

        res.json(user)
    }
    // catching the errors
    catch (error) {
        console.log(error)
        res.status(500).send('Internal Server Error!')
    }
})

module.exports = router