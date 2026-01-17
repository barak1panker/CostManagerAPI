'use strict';

const Log = require('./models/log.model');

async function getAllLogs(req, res, next) {
  try {
    const logs = await Log.find({}, { _id: 0 }).sort({ time: -1 }).lean();
    res.json(logs);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllLogs: getAllLogs
};
