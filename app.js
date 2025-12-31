// Loading environment variables from .env file
require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
// Initializing Pino logger for tracking server events as required
const logger = require('pino')({ transport: { target: 'pino-pretty' } })
const Log = require('./models/log');
const app = express()

// Middleware to parse JSON data in request body
app.use(express.json())

/* Middleware to log every request to the database.
   As required: every HTTP request must be saved to the logs collection.
*/
app.use(async (req, res, next) => {
    const logEntry = new Log({
        level: 'info',
        message: `Request received`,
        method: req.method,
        url: req.url
    });
    
    try {
        await logEntry.save();
    } catch (err) {
        console.error('Database log error:', err);
    }
    next();
});

// Connect to MongoDB Atlas using the URI from our .env file
// Change this part in your app.js
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        logger.info('Connected to MongoDB Atlas successfully');
    })
    .catch((err) => {
        // Updated to show the full error message
        logger.error(`Database connection error: ${err.message}`);
    });
// Simple health check route to see if the server is alive
app.get('/health', (req, res) => {
    res.json({ status: 'server is running' })
})

// Starting the server on the port defined in .env or default 3000
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`)
})
