const mongoose = require('mongoose')

const TicketSchema = mongoose.Schema({
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        product: {
            type: String,
            required: ['true', 'Please select a Product'],
            enum: ['iPhone', 'Macbook Pro', 'iMac', 'iPad']
        },
        description: {
            type: String,
            required: ['true', 'Please enter a description of the issue.']
        },
        status: {
            type: String,
            required: true,
            enum: ['new', 'open', 'closed'],
            default: 'new'
        },
    }, 
    { 
        timestamps: true
    }
)

module.exports = mongoose.model('Ticket', TicketSchema)

