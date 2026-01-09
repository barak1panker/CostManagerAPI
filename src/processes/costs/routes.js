'use strict';

const express = require('express');
const controller = require('./controller');

function buildRouter() {
  const router = express.Router();

  router.post('/add', controller.addCost);
  router.get('/report', controller.getMonthlyReport);

  return router;
}

module.exports = {
  buildRouter: buildRouter
};
