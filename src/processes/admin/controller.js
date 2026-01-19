'use strict';

const { logEndpointAccess } = require('../../shared/utils/endpointlog');

async function getAbout(req, res, next) {
  try {
    await logEndpointAccess(req, 'admin', 'GET /api/about'); // Save this endpoint access to logs

    res.json([
      { first_name: 'Adi', last_name: 'Beker' },
      { first_name: 'Barak', last_name: 'Panker' }
    ]);
  } catch (err) {
    next(err); // Send error to the global error handler
  }
}

module.exports = { getAbout }; // Export controller
