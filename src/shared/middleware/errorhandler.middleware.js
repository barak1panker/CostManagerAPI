'use strict';

function errorHandler(err, req, res, next) {
  let status = err && err.status ? err.status : 500;

  let errorId = err && err.id ? err.id : status;
  let message = err && err.message ? err.message : 'Unexpected error';

  if (err && err.code === 11000) {
    status = 409; // Mongo duplicate key error
    errorId = 11000;
    message = 'Duplicate key error: a record with the same id already exists';
  }

  res.status(status).json({
    id: errorId,
    message: message
  });
    
}

module.exports = errorHandler; // Export middleware
