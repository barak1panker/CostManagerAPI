'use strict';

const request = require('supertest');

test('Admin: GET /health returns ok', async function () {
  const res = await request('https://cost-manager-admin-ix1s.onrender.com').get('/health'); // Call admin health endpoint
  expect(res.status).toBe(200);
  expect(res.body).toEqual({ ok: true });
});

test('Admin: GET /api/about returns only first_name and last_name', async function () {
  const res = await request('https://cost-manager-admin-ix1s.onrender.com').get('/api/about'); // Call about endpoint
  expect(res.status).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);

  // Check that each item has only first_name and last_name
  if (res.body.length > 0) {
    expect(res.body[0]).toHaveProperty('first_name');
    expect(res.body[0]).toHaveProperty('last_name');
    expect(Object.keys(res.body[0]).length).toBe(2);
  }
});
