'use strict';

const express = require('express');
const controller = require('./controller');

function buildRouter() {
  const router = express.Router();

  router.get('/users', controller.getAllUsers);
  router.get('/users/:id', controller.getUserDetails);
  router.post('/add', controller.addUser);

  return router;
}

module.exports = {
  buildRouter: buildRouter
};
