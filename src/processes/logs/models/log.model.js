'use strict';

const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema(
  {
    time: { type: Date, required: true }, // When the log happened
    level: { type: String, required: true }, // Log level (info, error, etc.)
    process: { type: String, required: true }, // Which service/process created the log

    method: { type: String, required: true }, // HTTP method (GET/POST...)
    path: { type: String, required: true }, // Request path

    endpoint: { type: String, required: true }, // Endpoint name for tracking
    message: { type: String, required: true } // Log message text
  },
  {
    collection: 'logs', // MongoDB collection name
    versionKey: false
  }
);

module.exports = mongoose.model('Log', LogSchema); // Export Log model
