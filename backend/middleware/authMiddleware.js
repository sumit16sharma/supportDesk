const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

const protect = asyncHandler(async (req, res, next) => {
    let token 

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // get token from header
            token = req.headers.authorization.split(' ')[1]

            // verify the token 
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            
            req.user = await User.findById(decoded.id).select('-password')

            // if user not exists
            if (!req.user) {
                res.status(401)
                throw new Error('Not authirised')
            }

            next()
        } catch (error) {
            console.log(error)
            res.status(401);
            throw new Error('Not authorized')
        }
    }

    if(!token) {
        res.status(401);
        throw new Error('Not authorized')
    }
})

module.exports = { protect }