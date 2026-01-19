'use strict';

const Cost = require('./models/cost.model');
const ReportCache = require('./models/reportcache.model');
const { logEndpointAccess } = require('../../shared/utils/endpointlog');

const CATEGORIES = ['food', 'health', 'housing', 'sports', 'education'];

function buildEmptyCostsByCategory() {
  return {
    food: [],
    health: [],
    housing: [],
    sports: [],
    education: []
  };
}

function isPastMonth(year, month) {
  // Check if the requested (year, month) is before the current month
  const now = new Date();
  const currentYear = now.getUTCFullYear();
  const currentMonth = now.getUTCMonth() + 1;

  if (year < currentYear) return true;
  if (year === currentYear && month < currentMonth) return true;
  return false;
}

function parseOptionalDate(value) {
  // Convert optional date string to Date object (or return null/invalid)
  if (value === undefined || value === null || value === '') return null;

  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return 'invalid';

  return d;
}

async function addCost(req, res, next) {
  try {
    await logEndpointAccess(req, 'costs', 'POST /api/add'); // Save endpoint access log

    const body = req.body || {};

    const description = body.description;
    const category = body.category;
    const userid = Number(body.userid);
    const sum = Number(body.sum);

    // Basic input validation
    if (typeof description !== 'string' || description.trim().length === 0) {
      const err = new Error('description is required');
      err.id = 10;
      err.status = 400;
      throw err;
    }

    if (typeof category !== 'string' || category.trim().length === 0) {
      const err = new Error('category is required');
      err.id = 11;
      err.status = 400;
      throw err;
    }

    if (!CATEGORIES.includes(category.trim())) {
      const err = new Error('category must be one of: food, health, housing, sports, education');
      err.id = 16;
      err.status = 400;
      throw err;
    }

    if (!Number.isFinite(userid)) {
      const err = new Error('userid must be a number');
      err.id = 12;
      err.status = 400;
      throw err;
    }

    if (!Number.isFinite(sum) || sum < 0) {
      const err = new Error('sum must be a non-negative number');
      err.id = 13;
      err.status = 400;
      throw err;
    }

    const parsedDate = parseOptionalDate(body.date);

    if (parsedDate === 'invalid') {
      const err = new Error('date must be a valid date');
      err.id = 14;
      err.status = 400;
      throw err;
    }

    // If user sends a date, it cannot be in the past
    if (parsedDate) {
      const now = new Date();
      if (parsedDate.getTime() < now.getTime()) {
        const err = new Error('cost date cannot be in the past');
        err.id = 15;
        err.status = 400;
        throw err;
      }
    }

    const doc = {
      description: description.trim(),
      category: category.trim(),
      userid: userid,
      sum: sum
    };

    // If date provided, save it as createdAt/updatedAt
    if (parsedDate) {
      doc.createdAt = parsedDate;
      doc.updatedAt = parsedDate;
    }

    const created = await Cost.create(doc);

    res.json({
      description: created.description,
      category: created.category,
      userid: created.userid,
      sum: created.sum
    });
  } catch (err) {
    next(err);
  }
}

async function getMonthlyReport(req, res, next) {
  try {
    await logEndpointAccess(req, 'costs', 'GET /api/report'); // Save endpoint access log

    const userid = Number(req.query.id);
    const year = Number(req.query.year);
    const month = Number(req.query.month);

    // Validate query params
    if (!Number.isFinite(userid)) {
      const err = new Error('id must be a number');
      err.id = 20;
      err.status = 400;
      throw err;
    }

    if (!Number.isFinite(year) || year < 1970 || year > 3000) {
      const err = new Error('year must be a valid year');
      err.id = 21;
      err.status = 400;
      throw err;
    }

    if (!Number.isFinite(month) || month < 1 || month > 12) {
      const err = new Error('month must be between 1 and 12');
      err.id = 22;
      err.status = 400;
      throw err;
    }

    const shouldUseCache = isPastMonth(year, month); // Cache only for past months

    // Try to return cached report first (for past months)
    if (shouldUseCache) {
      const cached = await ReportCache.findOne(
        { userid: userid, year: year, month: month },
        { _id: 0, report: 1 }
      ).lean();

      if (cached && cached.report) {
        return res.json(cached.report);
      }
    }

    // Build date range for the requested month (UTC)
    const start = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
    const end = new Date(Date.UTC(year, month, 1, 0, 0, 0));

    const costs = await Cost.find(
      {
        userid: userid,
        createdAt: { $gte: start, $lt: end }
      },
      { _id: 0, description: 1, category: 1, sum: 1, createdAt: 1 }
    ).lean();

    // Group costs by category
    const grouped = buildEmptyCostsByCategory();

    for (const c of costs) {
      const day = new Date(c.createdAt).getUTCDate();

      if (grouped[c.category]) {
        grouped[c.category].push({
          sum: c.sum,
          description: c.description,
          day: day
        });
      }
    }

    // Convert grouped object into the required array format
    const costsArray = [];
    for (const cat of CATEGORIES) {
      const obj = {};
      obj[cat] = grouped[cat];
      costsArray.push(obj);
    }

    const report = {
      userid: userid,
      year: year,
      month: month,
      costs: costsArray
    };

    // Save cache for past months
    if (shouldUseCache) {
      await ReportCache.updateOne(
        { userid: userid, year: year, month: month },
        { $set: { report: report } },
        { upsert: true }
      );
    }

    res.json(report);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  addCost: addCost,
  getMonthlyReport: getMonthlyReport
};
