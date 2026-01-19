'use strict';

const request = require('supertest');

test('Users: GET /health returns ok', async function () {
  const res = await request('https://cost-manager-users-9kun.onrender.com').get('/health'); // Check users service is running
  expect(res.status).toBe(200);
  expect(res.body).toEqual({ ok: true });
});

test('Users: GET /api/users returns an array', async function () {
  const res = await request('https://cost-manager-users-9kun.onrender.com').get('/api/users'); // Get all users
  expect(res.status).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
});

test('Users: GET /api/users/:id returns required fields', async function () {
  const res = await request('https://cost-manager-users-9kun.onrender.com').get('/api/users/123123'); // Get user details by id
  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty('first_name');
  expect(res.body).toHaveProperty('last_name');
  expect(res.body).toHaveProperty('id', 123123);
  expect(res.body).toHaveProperty('total'); // Total costs sum for this user
});

test('Users: POST /api/add rejects invalid id', async function () {
  const res = await request('https://cost-manager-users-9kun.onrender.com').post('/api/add')
    .send({ id: 'abc', first_name: 'a', last_name: 'b', birthday: '1990-01-01' }); // Invalid id (not a number)

  expect(res.status).toBe(400);
  expect(res.body).toHaveProperty('id');
  expect(res.body).toHaveProperty('message');
});
