'use strict';

const express = require('express');
const controller = require('./controller');

function buildRouter() {
  const router = express.Router();

  router.get('/about', controller.getAbout);

  return router;
}

module.exports = {
  buildRouter: buildRouter
};
