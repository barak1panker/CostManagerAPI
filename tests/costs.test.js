'use strict';

const request = require('supertest');

test('Costs: GET /health returns ok', async function () {
  const res = await request('http://localhost:3002').get('/health');
  expect(res.status).toBe(200);
  expect(res.body).toEqual({ ok: true });
});

test('Costs: POST /api/add adds a cost', async function () {
  const res = await request('http://localhost:3002')
    .post('/api/add')
    .send({ description: 'test cost', category: 'food', userid: 123123, sum: 1 });

  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty('description', 'test cost');
  expect(res.body).toHaveProperty('category', 'food');
  expect(res.body).toHaveProperty('userid', 123123);
  expect(res.body).toHaveProperty('sum', 1);
});

test('Costs: POST /api/add rejects missing description', async function () {
  const res = await request('http://localhost:3002')
    .post('/api/add')
    .send({ category: 'food', userid: 123123, sum: 1 });

  expect(res.status).toBe(400);
  expect(res.body).toHaveProperty('id');
  expect(res.body).toHaveProperty('message');
});
