'use strict';

const { connectMongo } = require('../../config/mongo');
const { mustGet } = require('../../config/env');
const logger = require('../../config/logger');
const { buildApp } = require('./app');

async function start() {
  await connectMongo();
  logger.info('Connected to MongoDB');

  const app = buildApp();
  const port = Number(mustGet('USERS_PORT'));

  app.listen(port, function () {
    logger.info({ port: port }, 'Users process is listening');
  });
}

start().catch(function (err) {
  logger.error({ err: err }, 'Fatal startup error');
  process.exit(1);
});
