'use strict';

const mongoose = require('mongoose');
const { mustGet } = require('./env');

async function connectMongo() {
  const uri = mustGet('MONGODB_URI');
  await mongoose.connect(uri);
  return mongoose.connection;
}

module.exports = {
  connectMongo: connectMongo
};
