'use strict';

require('dotenv').config(); // Load variables from .env into process.env

function mustGet(name) {
  const value = process.env[name];

  if (!value) {
    const err = new Error('Missing environment variable: ' + name);
    err.id = 1; // Custom error id
    throw err;
  }

  return value;
}

module.exports = { mustGet }; // Export for other files
