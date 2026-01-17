'use strict';

const express = require('express');
const logger = require('../../config/logger');
const errorHandler = require('../../shared/middleware/errorhandler.middleware');
const { buildRouter } = require('./routes');
const requestLogMiddleware = require('../../shared/middleware/requestlog.middleware');

function buildApp() {
  const app = express();

  app.use(express.json());
  app.use(requestLogMiddleware('costs'));


  app.get('/health', function (req, res) {
    logger.info({ endpoint: '/health' }, 'costs health check');
    res.json({ ok: true });
  });

  app.use('/api', buildRouter());

  app.use(errorHandler);

  return app;
}

module.exports = {
  buildApp: buildApp
};
