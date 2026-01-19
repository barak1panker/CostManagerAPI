'use strict';

const express = require('express');
const controller = require('./controller');

function buildRouter() {
  const router = express.Router();

  router.post('/add', controller.addCost); // Add a new cost
  router.get('/report', controller.getMonthlyReport); // Get monthly report

  return router;
}

module.exports = { buildRouter }; // Export router builder
