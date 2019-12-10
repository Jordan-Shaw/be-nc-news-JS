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
            // console.log(response.body)
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
            // console.log(response.body);
            expect(response.body.user).to.be.an('Object');
            const { user } = response.body;
            expect(user).to.have.keys('username', 'avatar_url', 'name');
            expect(user.name).to.equal('jonny');
          })
      });
      it('/:username GET:404 Returns \'User does not exist\' when passed\n\t a valid username not found in the database', () => {
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
      it('/:article_id GET:404 Returns \'Article does not exist\' when passed \n\t a valid article_id not found in the database', () => {
        return request(app)
          .get('/api/articles/9999')
          .expect(404)
          .then(response => {
            expect(response.body.msg).to.equal('Article does not exist');
          })
      })
      it('/:article_id GET:400 Returns \'Invalid ID\' when passed \n\t an invalid article_id', () => {
        return request(app)
          .get('/api/articles/The_Thiefs_Journal')
          .expect(400)
          .then(response => {
            expect(response.body.msg).to.equal('Invalid ID');
          });
      });
      it('/:article_id PATCH:200 Successfully patches specified \n\tarticle when provided data in the correct format', () => {
        return request(app)
          .patch('/api/articles/1')
          .send({ inc_votes: 320 })
          .expect(200)
          .then(response => {
            expect(response.body.article).to.be.an('Object');
            expect(response.body.article.votes).to.equal(420);
          })
      });
      it('/:article_id PATCH:400 Returns \'Number of votes to add \n\tnot passed\' when passed no inc_votes on request body', () => {
        return request(app)
          .patch('/api/articles/1')
          .send({})
          .expect(400)
          .then(response => {
            expect(response.body.msg).to.equal('Number of votes to add not passed');
          })
      });
      it('/:article_id PATCH:400 Returns \'Invalid number of votes to add \n\t\' when passed invalid value for inc_votes on request body \n\t e.g. {inc_votes: \'cats\'}', () => {
        return request(app)
          .patch('/api/articles/1')
          .send({ inc_votes: "cats" })
          .expect(400)
          .then(response => {
            expect(response.body.msg).to.equal('Invalid number of votes to add');
          })
      });
      it('/:article_id PATCH:400 Returns \'Invalid properties in \n\t request\' when passed extra arguments other than inc_votes in \n\t the request body', () => {
        return request(app)
          .patch('/api/articles/1')
          .send({ inc_votes: "320", name: "Jordan" })
          .expect(400)
          .then(response => {
            expect(response.body.msg).to.equal('Invalid properties in request')
          });
      });
    });
  });
});