'use strict';

const express = require('express');
const controller = require('./controller');

function buildRouter() {
  const router = express.Router();

  router.get('/logs', controller.getAllLogs);

  return router;
}

module.exports = {
  buildRouter: buildRouter
};
