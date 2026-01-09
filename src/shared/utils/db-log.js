'use strict';

const Log = require('../../../models/log.model');

async function writeDbLog(info) {
  await Log.create({
    time: new Date(),
    level: info.level,
    process: info.process,
    method: info.method,
    path: info.path,
    endpoint: info.endpoint,
    message: info.message
  });
}

module.exports = {
  writeDbLog: writeDbLog
};
