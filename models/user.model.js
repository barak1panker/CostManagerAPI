'use strict';

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true
    },
    first_name: {
      type: String,
      required: true,
      trim: true
    },
    last_name: {
      type: String,
      required: true,
      trim: true
    },
    birthday: {
      type: Date,
      required: true
    }
  },
  {
    collection: 'users',
    versionKey: false
  }
);

module.exports = mongoose.model('User', UserSchema);
