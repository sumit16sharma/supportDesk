const express = require('express')
const dotenv = require('dotenv').config()
const colors = require('colors')
const { errorHandler } = require('./middleware/errorMiddleware')
const connectDB = require('./config/db')

const PORT = process.env.PORT || 5000

// Connect to Database
connectDB()

const app = express()

// Body Parser
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Routes
app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/tickets', require('./routes/ticketRoutes'))

app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server Started on PORT ${PORT}`)
})