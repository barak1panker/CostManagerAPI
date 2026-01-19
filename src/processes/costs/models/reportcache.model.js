'use strict';

const mongoose = require('mongoose');

const ReportCacheSchema = new mongoose.Schema(
  {
    userid: { type: Number, required: true }, // User id for this cached report
    year: { type: Number, required: true }, // Report year
    month: { type: Number, required: true }, // Report month
    report: { type: Object, required: true } // Saved report data
  },
  {
    collection: 'report_cache', // MongoDB collection name
    versionKey: false,
    timestamps: true // Auto add createdAt / updatedAt
  }
);

ReportCacheSchema.index({ userid: 1, year: 1, month: 1 }, { unique: true }); // One report per user+year+month

module.exports = mongoose.model('ReportCache', ReportCacheSchema); // Export model
