'use strict';

const express = require('express');
const controller = require('./controller');

function buildRouter() {
  const router = express.Router();

  router.get('/about', controller.getAbout); // GET /api/about route

  return router;
}

module.exports = { buildRouter }; // Export router builder
