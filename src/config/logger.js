'use strict';

const pino = require('pino');

const logger = pino({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug' // Production = less logs, Dev = more logs
});

module.exports = logger; // Export logger for other files
