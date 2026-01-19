'use strict';

const request = require('supertest');

test('Report: GET /api/report returns report structure', async function () {
  const res = await request('https://cost-manager-costs-4b42.onrender.com').get('/api/report?id=123123&year=2026&month=1'); // Request monthly report

  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty('userid', 123123);
  expect(res.body).toHaveProperty('year', 2026);
  expect(res.body).toHaveProperty('month', 1);
  expect(res.body).toHaveProperty('costs');
  expect(Array.isArray(res.body.costs)).toBe(true);
});

test('Report: GET /api/report rejects invalid month', async function () {
  const res = await request('https://cost-manager-costs-4b42.onrender.com').get('/api/report?id=123123&year=2026&month=13'); // Invalid month

  expect(res.status).toBe(400);
  expect(res.body).toHaveProperty('id');
  expect(res.body).toHaveProperty('message');
});
