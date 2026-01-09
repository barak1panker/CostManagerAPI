'use strict';

const request = require('supertest');

test('Logs: GET /health returns ok', async function () {
  const res = await request('http://localhost:3003').get('/health');
  expect(res.status).toBe(200);
  expect(res.body).toEqual({ ok: true });
});

test('Logs: GET /api/logs returns an array', async function () {
  const res = await request('http://localhost:3003').get('/api/logs');
  expect(res.status).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
});
