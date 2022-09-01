const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
        name: {
            type: String,
            required: ['true', 'Please add a name']
        },
        email: {
            type: String,
            unique: true,
            required: ['true', 'Please add an Email']
        },
        password: {
            type: String,
            required: ['true', 'Please add a Password']
        },
        isAdmin: {
            type: Boolean,
            required: true,
            default: false
        }
    }, 
    { 
        timestamps: true
    }
)

module.exports = mongoose.model('User', userSchema)

