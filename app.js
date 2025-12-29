// Loading environment variables from .env file
require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
// Initializing Pino logger for tracking server events as required
const logger = require('pino')({ transport: { target: 'pino-pretty' } })

const app = express()

// Middleware to parse JSON data in request body
app.use(express.json())

// Connect to MongoDB Atlas using the URI from our .env file
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        logger.info('Connected to MongoDB Atlas successfully')
    })
    .catch((err) => {
        logger.error('Database connection error: ', err)
    })

// Simple health check route to see if the server is alive
app.get('/health', (req, res) => {
    res.json({ status: 'server is running' })
})

// Starting the server on the port defined in .env or default 3000
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`)
})