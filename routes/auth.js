const express = require('express')
const router = express.Router()
const User = require('../models/User')
const { body, validationResult } = require('express-validator');
// require bcryptJS
const bcrypt = require('bcryptjs');

// require Dotenv file
require('dotenv').config()

// requireJWT token for user authentication
var jwt = require('jsonwebtoken');
// call the middleware
const FetchUser = require('../middlewares/FetchUser')


//ROUTE 1: Create a User Using: POST /api/auth/createuser No log in require
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
        //if user not exist
        else{

        // using Bcrypt hashing and salting proccess
        const salt = await bcrypt.genSalt(10)
        const secretPassword = await bcrypt.hash(req.body.password, salt)

        // when all ok create a user
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secretPassword,
        })

        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, process.env.JWT_STRING)

        res.json({success:true, authToken })
    }
}
    // catching the errors
    catch (error) {
        console.log(error)
        res.status(500).send('Internal Server Error!')
    }


})


// ROUTE 2 : Create a User Using: POST /api/auth/userlogin No log in require
router.post('/userlogin', [

    // username must be an email
    body('email', 'Enter a Valid Email!').isEmail(),

    // password must be at least 5 chars long
    body('password', 'Pleace Enter a Passward!').exists(),

], async (req, res) => {
    try {
        // if the user is not valid so return bad request 
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        let { email, password } = req.body
        // matching the email in our database email
        let user = await User.findOne({ email: email })
        if (!user) {
            return res.status(400).json({ error: "Invaild Creadentials!" })
        }

        let compPass = await bcrypt.compare(password, user.password)

        if (!compPass) {
            return res.status(400).json({ error: "Invaild Creadentials!" })
        }
        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, process.env.JWT_STRING)
        res.json({success:true, authToken })

    }
    catch (error) {
        console.log(error)
        res.status(500).send('Internal Server Error!')
    }


})

// ROUTE :03 Create a User DETAILS: POST /api/auth/loginedin  log in require
router.post('/getuser',FetchUser, async (req, res) => {
    try {
        const userid = req.user.id
  
        const user = await User.findById(userid).select('-password')
        res.send(user)
    }
    catch (error) {
        console.log(error)
        res.status(500).send('Internal Server Error!')
    }
})


module.exports = router