const asyncHandler = require('express-async-handler')
const Ticket = require('../models/ticketModel')
const User = require('../models/userModel')
const Note = require('../models/noteModel')

// @desc      Get Notes for Ticket
// @route     GET  /api/tickets/:ticketId/notes
// @access    Private
const getNotes = asyncHandler(async (req, res) => {
    // Get user using the id in the JWT
    const user = await User.findById(req.user.id)

    if(!user) {
        res.status(401)
        throw new Error('User not Found')
    }

    const ticket = await Ticket.findById(req.params.ticketId)
 
    if(ticket.user.toString() !== req.user.id) {
        res.status(401)
        throw new Error('User not Authorized')
    }

    const notes = await Note.find({ ticket: req.params.ticketId })

    res.status(200).json(notes)
})

// @desc      Create Note for Ticket
// @route     POST  /api/tickets/:ticketId/notes
// @access    Private
const addNote = asyncHandler(async (req, res) => {
    // Get user using the id in the JWT
    const user = await User.findById(req.user.id)

    if(!user) {
        res.status(401)
        throw new Error('User not Found')
    }

    const ticket = await Ticket.findById(req.params.ticketId)
 
    if(ticket.user.toString() !== req.user.id) {
        res.status(401)
        throw new Error('User not Authorized')
    }

    const note = await Note.create({ 
        ticket: req.params.ticketId,
        user: req.user.id,
        text: req.body.text,
        isStaff: false
     })

    res.status(201).json(note)
})

module.exports = {
    getNotes,
    addNote
}