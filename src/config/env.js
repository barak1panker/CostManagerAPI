'use strict';

require('dotenv').config();

function mustGet(name) {
  const value = process.env[name];
  if (!value) {
    const err = new Error('Missing environment variable: ' + name);
    err.id = 1;
    throw err;
  }
  return value;
}

module.exports = {
  mustGet: mustGet
};
