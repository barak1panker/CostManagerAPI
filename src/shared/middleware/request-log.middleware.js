'use strict';

const logger = require('../../config/logger');
const { writeDbLog } = require('../utils/db-log');

function requestLogMiddleware(processName) {
  return async function (req, res, next) {
    try {
      logger.info({ method: req.method, path: req.path, process: processName }, 'request received');

      await writeDbLog({
        level: 'info',
        process: processName,
        method: req.method,
        path: req.path,
        endpoint: 'request',
        message: 'request received'
      });
    } catch (err) {
      // לא עוצרים את השרת בגלל בעיית לוגים
      logger.error({ err: err, process: processName }, 'failed to write db log');
    }

    next();
  };
}

module.exports = requestLogMiddleware;
