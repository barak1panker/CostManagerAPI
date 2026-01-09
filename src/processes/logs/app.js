'use strict';

const express = require('express');
const logger = require('../../config/logger');
const errorHandler = require('../../shared/middleware/error-handler.middleware');
const { buildRouter } = require('./routes');

function buildApp() {
  const app = express();

  app.use(express.json());

  app.get('/health', function (req, res) {
    logger.info({ endpoint: '/health' }, 'logs health check');
    res.json({ ok: true });
  });

  app.use('/api', buildRouter());

  app.use(errorHandler);

  return app;
}

module.exports = {
  buildApp: buildApp
};
