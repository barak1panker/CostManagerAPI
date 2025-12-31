const mongoose = require('mongoose');

// Define the Log schema to store HTTP requests in the database
const logSchema = new mongoose.Schema({
    level: String,       // Log level (info, error, etc.)
    message: String,     // Log message
    method: String,      // HTTP Method (GET, POST)
    url: String,         // The endpoint accessed
    timestamp: { 
        type: Date, 
        default: Date.now 
    },
    // Required for error reporting
    errorId: Number, 
    details: Object      // Additional metadata from Pino
});

const Log = mongoose.model('Log', logSchema, 'logs');
module.exports = Log;