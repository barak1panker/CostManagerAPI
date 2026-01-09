'use strict';

const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema(
  {
    time: { type: Date, required: true },
    level: { type: String, required: true },
    process: { type: String, required: true },

    method: { type: String, required: true },
    path: { type: String, required: true },

    endpoint: { type: String, required: true },
    message: { type: String, required: true }
  },
  {
    collection: 'logs',
    versionKey: false
  }
);

module.exports = mongoose.model('Log', LogSchema);
