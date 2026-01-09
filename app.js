require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const logger = require('pino')({ transport: { target: 'pino-pretty' } })
const Log = require('./models/log.model') // Import Log model for DB logging

// Routes
const costRoutes = require('./routes/costs')
const userRoutes = require('./routes/users')
const aboutRoutes = require('./routes/about')
const reportRoutes = require('./routes/reports')
const logRoutes = require('./routes/logs')

const app = express()
app.use(express.json())

// Middleware to log every HTTP request to MongoDB Atlas
app.use(async (req, res, next) => {
    try {
        const newLog = new Log({
            method: req.method,
            url: req.url,
            params: req.method === 'GET' ? req.query : req.body
        })
        await newLog.save() // Save log item to the 'logs' collection
        next()
    } catch (err) {
        next() // Continue to ensure server reliability
    }
})

// Using Routes
app.use('/api', costRoutes)
app.use('/api', userRoutes)
app.use('/api', aboutRoutes)
app.use('/api', reportRoutes)
app.use('/api', logRoutes)

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => logger.info('Connected to MongoDB Atlas successfully'))
    .catch(err => logger.error('Database connection error: ', err))

const PORT = process.env.PORT || 3000
app.listen(PORT, () => logger.info(`Server running on port ${PORT}`))