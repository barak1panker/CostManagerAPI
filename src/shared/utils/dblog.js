'use strict';

const Log = require('../../processes/logs/models/log.model');

async function writeDbLog(info) {
  await Log.create({
    time: new Date(), // Log time (now)
    level: info.level,
    process: info.process,
    method: info.method,
    path: info.path,
    endpoint: info.endpoint,
    message: info.message
  }); // Save log to MongoDB
}

module.exports = { writeDbLog }; // Export function
