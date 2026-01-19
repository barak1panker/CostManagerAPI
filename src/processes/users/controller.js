'use strict';

const User = require('./models/user.model');
const Cost = require('../costs/models/cost.model');
const { logEndpointAccess } = require('../../shared/utils/endpointlog');

async function getAllUsers(req, res, next) {
  try {
    await logEndpointAccess(req, 'users', 'GET /api/users'); // Save endpoint access log

    const users = await User.find({}, { _id: 0 }).lean(); // Get all users
    res.json(users);
  } catch (err) {
    next(err); // Send error to global error handler
  }
}

async function getUserDetails(req, res, next) {
  try {
    await logEndpointAccess(req, 'users', 'GET /api/users/:id'); // Save endpoint access log

    const id = Number(req.params.id);

    if (!Number.isFinite(id)) {
      const err = new Error('Invalid user id');
      err.id = 2;
      err.status = 400;
      throw err;
    }

    const user = await User.findOne({ id: id }, { _id: 0 }).lean(); // Find user by id
    if (!user) {
      const err = new Error('User not found');
      err.id = 3;
      err.status = 404;
      throw err;
    }

    // Calculate the total sum of all costs for this user
    const agg = await Cost.aggregate([
      { $match: { userid: id } },
      { $group: { _id: null, total: { $sum: '$sum' } } }
    ]);

    const total = agg.length > 0 ? agg[0].total : 0;

    res.json({
      first_name: user.first_name,
      last_name: user.last_name,
      id: user.id,
      total: total
    });
  } catch (err) {
    next(err); // Send error to global error handler
  }
}

async function addUser(req, res, next) {
  try {
    await logEndpointAccess(req, 'users', 'POST /api/add'); // Save endpoint access log

    const body = req.body || {};

    const id = Number(body.id);
    const firstName = body.first_name;
    const lastName = body.last_name;
    const birthday = body.birthday;

    // Basic input validation
    if (!Number.isFinite(id)) {
      const err = new Error('id must be a number');
      err.id = 4;
      err.status = 400;
      throw err;
    }

    if (typeof firstName !== 'string' || firstName.trim().length === 0) {
      const err = new Error('first_name is required');
      err.id = 5;
      err.status = 400;
      throw err;
    }

    if (typeof lastName !== 'string' || lastName.trim().length === 0) {
      const err = new Error('last_name is required');
      err.id = 6;
      err.status = 400;
      throw err;
    }

    const date = new Date(birthday);
    if (Number.isNaN(date.getTime())) {
      const err = new Error('birthday must be a valid date');
      err.id = 7;
      err.status = 400;
      throw err;
    }

    const created = await User.create({
      id: id,
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      birthday: date
    });

    res.json({
      id: created.id,
      first_name: created.first_name,
      last_name: created.last_name,
      birthday: created.birthday
    });
  } catch (err) {
    next(err); // Send error to global error handler
  }
}

module.exports = {
  getAllUsers: getAllUsers,
  getUserDetails: getUserDetails,
  addUser: addUser
};
