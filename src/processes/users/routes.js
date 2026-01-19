'use strict';

const express = require('express');
const controller = require('./controller');

function buildRouter() {
  const router = express.Router();

  router.get('/users', controller.getAllUsers); // Get all users
  router.get('/users/:id', controller.getUserDetails); // Get one user + total costs
  router.post('/add', controller.addUser); // Add a new user

  return router;
}

module.exports = { buildRouter }; // Export router builder
