'use strict';

const request = require('supertest');

test('Logs: GET /health returns ok', async function () {
  const res = await request('https://cost-manager-logs-1q12.onrender.com').get('/health'); // Check logs service is running
  expect(res.status).toBe(200);
  expect(res.body).toEqual({ ok: true });
});

test('Logs: GET /api/logs returns an array', async function () {
  const res = await request('https://cost-manager-logs-1q12.onrender.com').get('/api/logs'); // Get all logs
  expect(res.status).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
});
