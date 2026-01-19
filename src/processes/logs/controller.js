'use strict';

const Log = require('./models/log.model');

async function getAllLogs(req, res, next) {
  try {
    const logs = await Log.find({}, { _id: 0 }).sort({ time: -1 }).lean(); // Get all logs, newest first
    res.json(logs);
  } catch (err) {
    next(err); // Send error to global error handler
  }
}

module.exports = { getAllLogs }; // Export controller
