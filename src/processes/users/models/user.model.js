'use strict';

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true // Each user must have a unique id
    },
    first_name: {
      type: String,
      required: true,
      trim: true // Remove spaces from start/end
    },
    last_name: {
      type: String,
      required: true,
      trim: true
    },
    birthday: {
      type: Date,
      required: true // User birth date
    }
  },
  {
    collection: 'users', // MongoDB collection name
    versionKey: false
  }
);

module.exports = mongoose.model('User', UserSchema); // Export User model
