'use strict';

const express = require('express');
const logger = require('../../config/logger');
const errorHandler = require('../../shared/middleware/errorhandler.middleware');
const { buildRouter } = require('./routes');
const requestLogMiddleware = require('../../shared/middleware/requestlog.middleware');

function buildApp() {
  const app = express();

  app.use(express.json()); // Parse JSON requests
  app.use(requestLogMiddleware('users')); // Log requests for the users service

  app.get('/health', function (req, res) {
    logger.info({ endpoint: '/health' }, 'health check'); // Simple health log
    res.json({ ok: true });
  });

  app.use('/api', buildRouter()); // Main API routes

  app.use(errorHandler); // Global error handler

  return app;
}

module.exports = { buildApp }; // Export app builder
