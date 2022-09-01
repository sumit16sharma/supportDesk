const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

// @desc      Register a new User
// @route     /api/users
// @access    Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // validation
    if(!name || !email || !password) {
        res.status(400)
        throw new Error('Please include all fields')
    }

    // Find if user already exists
    const userExists = await User.findOne({ email })

    if(userExists) {
        res.status(400)
        throw new Error('User already Exists')
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // create user
    const user = await User.create({
        email, 
        name,
        password: hashedPassword,
    })

    if(user) {
        res.status(201).json({ 
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
         })
    } else {
        res.status(400);
        throw new Error('Invalid user Data')
    }
})

// @desc      Login User
// @route     /api/users/login
// @access    Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if(user && (await bcrypt.compare(password, user.password))) {
        return res.status(200).json({ 
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    } else {
        res.status(401)
        throw new Error('Invalid Credentials');
    }  
})

// @desc      Get current user 
// @route     /api/users/me
// @access    Private
const getMe = asyncHandler (async (req, res) => {
    const user = {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email
    }

    return res.status(200).json(user)
})

// generate token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' })
}

module.exports = {
    registerUser,
    loginUser,
    getMe
}