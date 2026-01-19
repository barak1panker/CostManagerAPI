'use strict';

const logger = require('../../config/logger');
const { writeDbLog } = require('../utils/dblog');

function requestLogMiddleware(processName) {
  return async function (req, res, next) {
    try {
      logger.info({ method: req.method, path: req.path, process: processName }, 'request received'); // Log request to console

      await writeDbLog({
        level: 'info',
        process: processName,
        method: req.method,
        path: req.path,
        endpoint: 'request',
        message: 'request received'
      }); // Save request log to MongoDB
    } catch (err) {
      logger.error({ err: err, process: processName }, 'failed to write db log'); // If DB logging fails
    }

    next(); // Continue to the next middleware/route
  };
}

module.exports = requestLogMiddleware; // Export middleware
