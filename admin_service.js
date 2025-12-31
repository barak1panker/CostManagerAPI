// 1. Load environment variables from the .env file for security
require('dotenv').config();

// 2. Import express and mongoose to create the server and connect to the DB
const express = require('express');
const mongoose = require('mongoose');

// 3. Import the Log model to save every request to MongoDB as required
const Log = require('./models/log');
const logger = require('pino')({ transport: { target: 'pino-pretty' } });

const app = express();
app.use(express.json());

// 4. Middleware to log every HTTP request to the database
app.use(async (req, res, next) => {
    const logEntry = new Log({
        level: 'info',
        message: 'Admin Service: request received',
        method: req.method,
        url: req.url
    });
    try {
        await logEntry.save();
    } catch (err) {
        console.error('Failed to save log:', err);
    }
    next();
});

/* 5. Endpoint: Get developers' details
   Route: /api/about
   Requirement: Return a JSON with first_name and last_name of the team
*/
app.get('/api/about', (req, res) => {
    try {
        const team = [
            { first_name: 'YourFirstName', last_name: 'YourLastName' },
            { first_name: 'PartnerFirstName', last_name: 'PartnerLastName' }
        ];
        // Send the JSON response back to the user
        res.json(team);
    } catch (err) {
        // Requirement: Errors must include id and message properties
        res.status(500).json({
            id: 500,
            message: `Error retrieving developers info: ${err.message}`
        });
    }
});

// 6. Connect to MongoDB and start the server on a different port
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        // Each process should run on a separate port (e.g., 3001)
        const PORT = 3001; 
        app.listen(PORT, () => {
            logger.info(`Admin Service is running on port ${PORT}`);
        });
    })
    .catch(err => {
        logger.error(`Database connection error: ${err.message}`);
    });