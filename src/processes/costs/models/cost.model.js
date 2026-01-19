'use strict';

const mongoose = require('mongoose');

const CostSchema = new mongoose.Schema(
  {
    description: { type: String, required: true, trim: true }, // Cost description
    category: {
      type: String,
      required: true,
      enum: ['food', 'health', 'housing', 'sports', 'education'] // Allowed categories
    },
    userid: { type: Number, required: true }, // User id who owns this cost
    sum: { type: Number, required: true, min: 0 } // Cost amount (must be >= 0)
  },
  {
    collection: 'costs', // MongoDB collection name
    versionKey: false,
    timestamps: true // Auto add createdAt / updatedAt
  }
);

module.exports = mongoose.model('Cost', CostSchema); // Export Cost model
