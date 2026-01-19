'use strict';

const express = require('express');
const controller = require('./controller');

function buildRouter() {
  const router = express.Router();

  router.get('/logs', controller.getAllLogs); // GET all logs

  return router;
}

module.exports = { buildRouter }; // Export router builder
