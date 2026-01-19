'use strict';

const mongoose = require('mongoose');
const { mustGet } = require('./env');

async function connectMongo() {
  const uri = mustGet('MONGODB_URI'); // Get MongoDB connection string from env
  await mongoose.connect(uri); // Connect to MongoDB
  return mongoose.connection; // Return the connection object
}

module.exports = { connectMongo }; // Export for other files
