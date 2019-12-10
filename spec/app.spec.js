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
            expect(response.body.topics).to.be.an('Array');
            const { topics } = response.body
            expect(topics[0]).to.have.keys('slug', 'description');
            expect(topics.length).to.equal(3);
          })
      });
    });
    describe('/users', () => {
      it('/:username GET:200 Returns the specified user', () => {
        return request(app)
          .get('/api/users/butter_bridge')
          .expect(200)
          .then(response => {
            expect(response.body.user).to.be.an('Object');
            const { user } = response.body;
            expect(user).to.have.keys('username', 'avatar_url', 'name');
            expect(user.name).to.equal('jonny');
          })
      });
      it('/:username GET:404 Returns \'User does not exist\' when passed\n\t\t\t a username not found in the database', () => {
        return request(app)
          .get('/api/users/Jean_Genet')
          .expect(404)
          .then(response => {
            expect(response.body.msg).to.equal('User does not exist');
          })
      })
    });
    describe('/articles', () => {
      it('/:article_id GET:200 Returns the specified article', () => {
        return request(app)
          .get('/api/articles/1')
          .expect(200)
          .then(response => {
            expect(response.body.article).to.be.an('Object');
            const { article } = response.body;
            expect(article).to.have.keys('article_id', 'title', 'body', 'votes', 'topic', 'author', 'created_at')
          })
      });
    });
  });
});