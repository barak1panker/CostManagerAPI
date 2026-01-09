'use strict';

const { writeDbLog } = require('./db-log');

async function logEndpointAccess(req, processName, endpointName) {
  try {
    await writeDbLog({
      level: 'info',
      process: processName,
      method: req.method,
      path: req.originalUrl,
      endpoint: endpointName,
      message: 'endpoint accessed'
    });
  } catch (err) {
  }
}

module.exports = {
  logEndpointAccess: logEndpointAccess
};
