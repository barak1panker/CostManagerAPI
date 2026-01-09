'use strict';

const { logEndpointAccess } = require('../../shared/utils/endpoint-log');

async function getAbout(req, res, next) {
  try {
    await logEndpointAccess(req, 'admin', 'GET /api/about');

    res.json([
      { first_name: 'Adi', last_name: 'Beker' },
      { first_name: 'Barak', last_name: 'Panker' }
    ]);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAbout: getAbout
};
