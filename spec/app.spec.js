process.env.NODE_ENV = 'test';
const request = require('supertest');
const { expect } = require('chai');
const knextion = require('../db/connection.js');
const app = require('../app');

describe('app', () => {
  beforeEach(() => {
    return knextion.seed.run();
  });
  after(() => {
    return knextion.destroy();
  })
  describe('/api', () => {
    describe('/topics', () => {
      it('GET:200 Returns the topics table', () => {
        return request(app)
          .get('/api/topics')
          .expect(200)
          .then(response => {
            const topics = response.body;
            expect(topics[0]).to.have.keys('slug', 'description');
          })
      });
    });
  });
});