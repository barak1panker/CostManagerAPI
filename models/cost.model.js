'use strict';

const mongoose = require('mongoose');

const CostSchema = new mongoose.Schema(
  {
    description: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ['food', 'health', 'housing', 'sports', 'education']
    },
    userid: { type: Number, required: true },
    sum: { type: Number, required: true, min: 0 }
  },
  {
    collection: 'costs',
    versionKey: false,
    timestamps: true
  }
);

module.exports = mongoose.model('Cost', CostSchema);
