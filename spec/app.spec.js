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
      it('/:article_id GET:404 Returns \'Article does not exist\' when \n\t passed a valid article_id not found in the database', () => {
        return request(app)
          .get('/api/articles/9999')
          .expect(404)
          .then(response => {
            expect(response.body.msg).to.equal('Article does not exist');
          });
      });
      it('/:article_id GET:400 Returns \'Invalid ID\' when passed \n\t an invalid article_id', () => {
        return request(app)
          .get('/api/articles/The_Thiefs_Journal')
          .expect(400)
          .then(response => {
            expect(response.body.msg).to.equal('Invalid Article ID');
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
      it('/:article_id PATCH:400 Returns \'Invalid number of votes \n\t to add\' when passed invalid value for \n\t inc_votes on request body \n\t e.g. {inc_votes: \'cats\'}', () => {
        return request(app)
          .patch('/api/articles/1')
          .send({ inc_votes: "cats" })
          .expect(400)
          .then(response => {
            expect(response.body.msg).to.equal('Invalid number of votes to add');
          })
      });
      it('/:article_id PATCH:400 Returns \'Number of votes to add \n\tnot passed\' when passed argument other than inc_votes in \n\t the request body', () => {
        return request(app)
          .patch('/api/articles/1')
          .send({ name: "Jordan" })
          .expect(400)
          .then(response => {
            expect(response.body.msg).to.equal('Number of votes to add not passed')
          });
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
      it('/:article_id PATCH:404 Returns \'Article does not exist\' \n\t when passed incorrect article_id', () => {
        return request(app)
          .patch('/api/articles/9999')
          .send({ inc_votes: 1000 })
          .expect(404)
          .then(response => {
            expect(response.body.msg).to.equal('Article does not exist');
          })
      })
      it('/:article_id/comments GET:200 Returns all of the \n\t comments for a given article', () => {
        return request(app)
          .get('/api/articles/1/comments')
          .expect(200)
          .then(response => {
            expect(response.body.comments).to.be.an('Array');
            const { comments } = response.body;
            expect(comments[0]).to.have.keys('comment_id', 'votes', 'created_at', 'author', 'body')
          })
      });
      it('/:article_id/comments GET:400 Returns \'Invalid ID\' when \n\t passed an invalid article_id to fetch comments for', () => {
        return request(app)
          .get('/api/articles/The_Thiefs_Journal/comments')
          .expect(400)
          .then(response => {
            expect(response.body.msg).to.equal('Invalid Article ID');
          });
      });
      it('/:article_id/comments GET:404 Returns \'Article does not \n\t exist\' when passed a valid article_id not \n\t found in the database', () => {
        return request(app)
          .get('/api/articles/9999/comments')
          .expect(404)
          .then(response => {
            expect(response.body.msg).to.equal('Article does not exist');
          });
      });
      it('/:article_id/comments GET:200 Returns an empty array \n\t when passed an extant article\'s ID with no comments', () => {
        return request(app)
          .get('/api/articles/2/comments')
          .expect(200)
          .then(response => {
            expect(response.body).to.deep.equal({ comments: [] });
          });
      });
      it('/:article_id/comments POST:200 Succesfully adds a \n\t comment and returns posted comment when passed an \n\t extant article\'s ID and req.body', () => {
        return request(app)
          .post('/api/articles/2/comments')
          .send({ username: 'butter_bridge', body: 'Test, test test test!' })
          .expect(200)
          .then(response => {
            expect(response.body.comment).to.be.an('Object');
            const { comment } = response.body;
            expect(comment).to.have.keys('comment_id', 'votes', 'created_at', 'author', 'body')
            return request(app)
              .get('/api/articles/2/comments')
              .expect(200)
              .then(response => {
                expect(response.body.comments.length).to.equal(1);
              });
          });
      });
      it('/:article_id/comments POST:400 Returns \'No username \n\t provided\' when username property not passed in sent object', () => {
        return request(app)
          .post('/api/articles/2/comments')
          .send({ body: 'Shouldn\'t be added!' })
          .expect(400)
          .then(response => {
            expect(response.body.msg).to.equal('No username provided')
          });
      });
      it('/:article_id/comments POST:400 Returns \'No text \n\t provided\' when body property not passed in sent object', () => {
        return request(app)
          .post('/api/articles/2/comments')
          .send({ username: 'Shouldn\'t be added!' })
          .expect(400)
          .then(response => {
            expect(response.body.msg).to.equal('No text provided')
          });
      });
      it('/:article_id/comments POST:400 Returns \'Invalid properties \n\t provided\' when properties other than body/username are \n\t passed in sent object', () => {
        return request(app)
          .post('/api/articles/2/comments')
          .send({ username: 'butter_bridge', body: 'Shouldn\'t be added!', votes: 25 })
          .expect(400)
          .then(response => {
            expect(response.body.msg).to.equal('Invalid properties provided')
          });
      });
      it('/:article_id/comments POST:404 Returns \'Incorrect username \n\t provided\' when an incorrect username is \n\t passed in sent object', () => {
        return request(app)
          .post('/api/articles/2/comments')
          .send({ username: 'butter_ridge', body: 'Shouldn\'t be added!' })
          .expect(404)
          .then(response => {
            expect(response.body.msg).to.equal('Incorrect username provided')
          });
      });
      it('/:article_id/comments POST:404 Returns \'Article does not \n\t exist\' when passed valid but incorrect article_id', () => {
        return request(app)
          .post('/api/articles/9999/comments')
          .send({ username: 'butter_bridge', body: 'Shouldn\'t be added!' })
          .expect(404)
          .then(response => {
            expect(response.body.msg).to.equal('Article does not exist');
          })
      })
      it('/ GET:200 Returns all of the articles, including a \n\t comment count', () => {
        return request(app)
          .get('/api/articles/')
          .expect(200)
          .then(response => {
            expect(response.body).to.be.an('Object');
            expect(response.body.articles).to.be.an('Array');
            const { articles } = response.body;
            expect(articles[0]).to.be.an('Object');
            expect(articles[0]).to.have.keys('article_id', 'title', 'body', 'votes', 'topic', 'author', 'created_at', 'comment_count');
          });
      });
    });
    describe('/comments', () => {
      it('/:comment_id PATCH:200 Successfully adds passed \n\t number of votes to \'votes\' property and returns the \n\t modified comment', () => {
        return request(app)
          .patch('/api/comments/1')
          .send({ inc_votes: 404 })
          .expect(200)
          .then(response => {
            expect(response.body).to.be.an('Object');
            expect(response.body.comment).to.be.an('Object');
            const { comment } = response.body;
            expect(comment).to.have.keys('comment_id', 'votes', 'created_at', 'author', 'body');
            expect(comment.votes).to.equal(420);
          });
      });
      xit('/:comment_id PATCH:404 Returns \'Comment does not exist\' \n\t when passed incorrect comment_id', () => {
        return request(app)
      })
    });
  });
});

//NEED TO DO PATCH:404 FOR ARTICLES, FOR WHEN ARTICLE DOESN'T EXIST ETC.