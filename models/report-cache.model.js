'use strict';

const mongoose = require('mongoose');

const ReportCacheSchema = new mongoose.Schema(
  {
    userid: { type: Number, required: true },
    year: { type: Number, required: true },
    month: { type: Number, required: true },

    report: { type: Object, required: true }
  },
  {
    collection: 'report_cache',
    versionKey: false,
    timestamps: true
  }
);

ReportCacheSchema.index({ userid: 1, year: 1, month: 1 }, { unique: true });

module.exports = mongoose.model('ReportCache', ReportCacheSchema);
