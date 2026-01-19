'use strict';

const { writeDbLog } = require('./dblog');

async function logEndpointAccess(req, processName, endpointName) {
  try {
    await writeDbLog({
      level: 'info',
      process: processName,
      method: req.method,
      path: req.originalUrl,
      endpoint: endpointName,
      message: 'endpoint accessed'
    }); // Save endpoint access log to MongoDB
  } catch (err) {
    // Ignore log errors (do not break the request)
  }
}

module.exports = { logEndpointAccess }; // Export function
