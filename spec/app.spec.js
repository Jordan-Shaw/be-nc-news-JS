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
      it('/:username GET:404 Returns \'User does not exist\' when passed a valid username not found in the database', () => {
        return request(app)
          .get('/api/users/Jean_Genet')
          .expect(404)
          .then(response => {
            expect(response.body.msg).to.equal('User does not exist');
          });
      });
      it('/:username PUT:405 Returns Method Not Found when put requested', () => {
        return request(app)
          .put('/api/users/butter_bridge')
          .send({ user: 'butter_bridge', avatar_url: "www.google.com" })
          .expect(405)
          .then(response => {
            expect(response.body.msg).to.equal("Method Not Found");
          });
      });
    });
    describe('/articles', () => {
      it('/:article_id GET:200 Returns the specified article', () => {
        return request(app)
          .get('/api/articles/1')
          .expect(200)
          .then(response => {
            expect(response.body.article).to.be.an('Object');
            const { article } = response.body;
            expect(article).to.have.keys('article_id', 'title', 'body', 'votes', 'topic', 'author', 'created_at', 'comment_count')
          })
      });
      it('/:article_id GET:404 Returns \'Article does not exist\' when passed a valid article_id not found in the database', () => {
        return request(app)
          .get('/api/articles/9999')
          .expect(404)
          .then(response => {
            expect(response.body.msg).to.equal('Article does not exist');
          });
      });
      it('/:article_id GET:400 Returns \'Invalid ID provided\' when passed an invalid article_id', () => {
        return request(app)
          .get('/api/articles/The_Thiefs_Journal')
          .expect(400)
          .then(response => {
            expect(response.body.msg).to.equal('Invalid ID provided');
          });
      });
      it('/:article_id PATCH:200 Successfully patches specified article when provided data in the correct format', () => {
        return request(app)
          .patch('/api/articles/1')
          .send({ inc_votes: 320 })
          .expect(200)
          .then(response => {
            expect(response.body.article).to.be.an('Object');
            expect(response.body.article.votes).to.equal(420);
          })
      });
      it('/:article_id PATCH:200 Returns unchanged article when passed no inc_votes on request body', () => {
        return request(app)
          .patch('/api/articles/1')
          .send({})
          .expect(200)
          .then(response => {
            expect(response.body.article.votes).to.equal(100);
          })
      });
      it('/:article_id PATCH:400 Returns \'Invalid number of votes to add\' when passed invalid value for inc_votes on request body e.g. {inc_votes: \'cats\'}', () => {
        return request(app)
          .patch('/api/articles/1')
          .send({ inc_votes: "cats" })
          .expect(400)
          .then(response => {
            expect(response.body.msg).to.equal('Invalid number of votes to add');
          })
      });
      it('/:article_id PATCH:400 Returns \'Invalid properties in request\' when passed argument other than inc_votes in the request body', () => {
        return request(app)
          .patch('/api/articles/1')
          .send({ name: "Jordan" })
          .expect(400)
          .then(response => {
            expect(response.body.msg).to.equal('Invalid properties in request')
          });
      });
      it('/:article_id PATCH:400 Returns \'Invalid properties in request\' when passed extra arguments other than inc_votes in the request body', () => {
        return request(app)
          .patch('/api/articles/1')
          .send({ inc_votes: "320", name: "Jordan" })
          .expect(400)
          .then(response => {
            expect(response.body.msg).to.equal('Invalid properties in request')
          });
      });
      it('/:article_id PATCH:404 Returns \'Article does not exist\' when passed incorrect article_id', () => {
        return request(app)
          .patch('/api/articles/9999')
          .send({ inc_votes: 1000 })
          .expect(404)
          .then(response => {
            expect(response.body.msg).to.equal('Article does not exist');
          });
      });
      it('/:article_id PATCH:400 Returns \'Invalid ID provided\' when passed an invalid article_id', () => {
        return request(app)
          .patch('/api/articles/The_Thiefs_Journal')
          .send({ inc_votes: 1000 })
          .expect(400)
          .then(response => {
            expect(response.body.msg).to.equal('Invalid ID provided');
          });
      });
      it('/:article_id/comments GET:200 Returns all of the comments for a given article', () => {
        return request(app)
          .get('/api/articles/1/comments')
          .expect(200)
          .then(response => {
            expect(response.body.comments).to.be.an('Array');
            const { comments } = response.body;
            expect(comments[0]).to.have.keys('comment_id', 'votes', 'created_at', 'author', 'body')
          })
      });
      it('/:article_id/comments GET:400 Returns \'Invalid ID provided\' when passed an invalid article_id to fetch comments for', () => {
        return request(app)
          .get('/api/articles/The_Thiefs_Journal/comments')
          .expect(400)
          .then(response => {
            expect(response.body.msg).to.equal('Invalid ID provided');
          });
      });
      it('/:article_id/comments GET:404 Returns \'Article does not exist\' when passed a valid article_id not found in the database', () => {
        return request(app)
          .get('/api/articles/9999/comments')
          .expect(404)
          .then(response => {
            expect(response.body.msg).to.equal('Article does not exist');
          });
      });
      it('/:article_id/comments GET:200 Returns an empty array when passed an extant article\'s ID with no comments', () => {
        return request(app)
          .get('/api/articles/2/comments')
          .expect(200)
          .then(response => {
            expect(response.body).to.deep.equal({ comments: [] });
          });
      });
      it('/:article_id/comments POST:201 Succesfully adds a comment and returns posted comment when passed an extant article\'s ID and req.body', () => {
        return request(app)
          .post('/api/articles/2/comments')
          .send({ username: 'butter_bridge', body: 'Test, test test test!' })
          .expect(201)
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
      it('/:article_id/comments POST:400 Returns \'No username provided\' when username property not passed in sent object', () => {
        return request(app)
          .post('/api/articles/2/comments')
          .send({ body: 'Shouldn\'t be added!' })
          .expect(400)
          .then(response => {
            expect(response.body.msg).to.equal('No username provided')
          });
      });
      it('/:article_id/comments POST:400 Returns \'No text provided\' when body property not passed in sent object', () => {
        return request(app)
          .post('/api/articles/2/comments')
          .send({ username: 'Shouldn\'t be added!' })
          .expect(400)
          .then(response => {
            expect(response.body.msg).to.equal('No text provided')
          });
      });
      it('/:article_id/comments POST:400 Returns \'Invalid properties provided\' when properties other than body/username are passed in sent object', () => {
        return request(app)
          .post('/api/articles/2/comments')
          .send({ username: 'butter_bridge', body: 'Shouldn\'t be added!', votes: 25 })
          .expect(400)
          .then(response => {
            expect(response.body.msg).to.equal('Invalid properties provided')
          });
      });
      it('/:article_id/comments POST:404 Returns \'Incorrect username provided\' when an incorrect username is passed in sent object', () => {
        return request(app)
          .post('/api/articles/2/comments')
          .send({ username: 'butter_ridge', body: 'Shouldn\'t be added!' })
          .expect(404)
          .then(response => {
            expect(response.body.msg).to.equal('Incorrect username provided')
          });
      });
      it('/:article_id/comments POST:404 Returns \'Article does not exist\' when passed valid but incorrect article_id', () => {
        return request(app)
          .post('/api/articles/9999/comments')
          .send({ username: 'butter_bridge', body: 'Shouldn\'t be added!' })
          .expect(404)
          .then(response => {
            expect(response.body.msg).to.equal('Article does not exist');
          });
      });
      it('/:article_id/comments Should accept a sort_by query and order', () => {
        return request(app)
          .get('/api/articles/1/comments?sort_by=votes')
          .expect(200)
          .then(response => {
            expect(response.body.comments[0].author).to.equal('icellusedkars')
          });
      });
      it('/:article_id/comments Will sort_by ASC or DESC order', () => {
        return request(app)
          .get('/api/articles/5/comments?sort_by=votes&order=asc')
          .expect(200)
          .then(response => {
            expect(response.body.comments[0].author).to.equal('butter_bridge')
          });
      });
      it('/articles/ GET:200 Returns all of the articles, including a comment count', () => {
        return request(app)
          .get('/api/articles/')
          .expect(200)
          .then(response => {
            expect(response.body).to.be.an('Object');
            expect(response.body.articles).to.be.an('Array');
            const { articles } = response.body;
            expect(articles[0]).to.be.an('Object');
            expect(articles[0]).to.have.keys('article_id', 'title', 'votes', 'topic', 'author', 'created_at', 'comment_count');
          });
      });
      it('/api/articles?author= GET:200 Should accept an author query', () => {
        return request(app)
          .get('/api/articles?author=butter_bridge')
          .expect(200)
          .then(response => {
            expect(response.body.articles.length).to.equal(3);
          });
      });
      it('/api/articles?topics= GET:200 Should accept a topics query', () => {
        return request(app)
          .get('/api/articles?topic=cats')
          .expect(200)
          .then(response => {
            expect(response.body.articles.length).to.equal(1);
          });
      });
      it('/api/articles?sort_by=puppies GET:400 Responds with \'Cannot sort by ${query} - ${query} column does not exist\'', () => {
        return request(app)
          .get('/api/articles?sort_by=puppies')
          .expect(400)
          .then(response => {
            expect(response.body.msg).to.equal('Cannot sort by puppies - puppies column does not exist');
          });
      });
      it('/api/articles?order=puppies GET:400 Responds with \'Cannot order by ${query} - order must be asc or desc\'', () => {
        return request(app)
          .get('/api/articles?order=puppies')
          .expect(400)
          .then(response => {
            expect(response.body.msg).to.equal('Cannot order by puppies - order must be asc or desc');
          });
      });
      it('/api/articles?author=puppies GET:404 Responds with \'Author ${query} is not in the database\'', () => {
        return request(app)
          .get('/api/articles?author=puppies')
          .expect(404)
          .then(response => {
            expect(response.body.msg).to.equal('Author puppies is not in the database');
          });
      });
      it('/api/articles?topic=puppies GET:404 Responds with \'Topic ${query} is not in the database\'', () => {
        return request(app)
          .get('/api/articles?topic=puppies')
          .expect(404)
          .then(response => {
            expect(response.body.msg).to.equal('Topic puppies is not in the database');
          });
      });
      it('/api/articles/1/comments?sort_by=votes GET:200 responds with the correct comments', () => {
        return request(app)
          .get('/api/articles/1/comments?sort_by=votes')
          .expect(200)
          .then(response => {
            expect(response.body.comments.length).to.equal(13);
            expect(response.body.comments[0].votes).to.equal(100);
          });
      })
    });
    describe('/comments', () => {
      it('/:comment_id PATCH:200 Successfully adds passed number of votes to \'votes\' property and returns the modified comment', () => {
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
      it('/:comment_id PATCH:404 Returns \'Comment does not exist\' when passed incorrect comment_id', () => {
        return request(app)
          .patch('/api/comments/9999')
          .send({ inc_votes: 404 })
          .expect(404)
          .then(response => {
            expect(response.body.msg).to.equal('Comment does not exist');
          });
      });
      it('/:comment_id PATCH:400 Returns \'Invalid comment ID\' when passed invalid comment_id', () => {
        return request(app)
          .patch('/api/comments/The_Thiefs_Journal')
          .send({ inc_votes: 404 })
          .expect(400)
          .then(response => {
            expect(response.body.msg).to.equal('Invalid ID provided');
          });
      });
      it('/:comment_id PATCH:400 Returns \'Invalid properties in request\' when sent property other than inc_votes', () => {
        return request(app)
          .patch('/api/comments/1')
          .send({ name: 'Jordan' })
          .expect(400)
          .then(response => {
            expect(response.body.msg).to.equal('Invalid properties in request');
          });
      });
      it('/:comment_id PATCH:400 Responds with \'Invalid properties in request\' when passed invalid properties', () => {
        return request(app)
          .patch('/api/comments/1')
          .send({ inc_votes: 408, name: 'Jordan' })
          .expect(400)
          .then(response => {
            expect(response.body.msg).to.equal('Invalid properties in request')
          });
      });
      it('/:comment_id PATCH:400 Responds with \'Invalid number of votes to add\' when passed inc_votes datatype != number', () => {
        return request(app)
          .patch('/api/comments/1')
          .send({ inc_votes: 'Jordan' })
          .expect(400)
          .then(response => {
            expect(response.body.msg).to.equal('Invalid number of votes to add')
          })
      })
      it('/:comment_id DELETE:200 Should delete the given comment and respond with no content.', () => {
        return request(app)
          .delete('/api/comments/1')
          .expect(204)
          .then(() => {
            return request(app)
              .get('/api/comments/')
              .expect(200)
              .then(response => {
                expect(response.body.comments.length).to.equal(17);
              })
          });
      });
      it('/:comment_id PATCH:404 Returns \'Comment does not exist\' when passed incorrect comment_id', () => {
        return request(app)
          .delete('/api/comments/9999')
          .expect(404)
          .then(response => {
            expect(response.body.msg).to.equal('Comment does not exist');
          });
      });
      it('/:comment_id PATCH:400 Returns \'Invalid comment ID\' when passed invalid comment_id', () => {
        return request(app)
          .delete('/api/comments/The_Thiefs_Journal')
          .expect(400)
          .then(response => {
            expect(response.body.msg).to.equal('Invalid ID provided');
          });
      });
      it('/articles/ GET:200 Sort_by author defaults to descending', () => {
        return request(app)
          .get('/api/articles?sort_by=author')
          .expect(200)
          .then(response => {
            expect(response.body.articles[0].author).to.equal('rogersop');
          });
      });
      it('/articles/ GET:200 Sort_by defaults to date', () => {
        return request(app)
          .get('/api/articles?order=asc')
          .expect(200)
          .then(response => {
            expect(response.body.articles[0].title).to.equal('Moustache');
          });
      });
      it('/articles/ PATCH:405 responds with method not found', () => {
        return request(app)
          .patch('/api/articles')
          .send({ msg: 'Wabbajack' })
          .expect(405)
          .then(response => {
            expect(response.body.msg).to.equal('Method Not Found');
          });
      });
      it('/articles/:comment_id GET:200 responds with correct comment count', () => {
        return request(app)
          .get('/api/articles/1')
          .expect(200)
          .then(response => {
            expect(response.body.article.comment_count).to.equal('13');
          });
      });
      it('/articles/ PUT:405 responds with method not found', () => {
        return request(app)
          .put('/api/articles/1')
          .send({ msg: 'Wabbajack' })
          .expect(405)
          .then(response => {
            expect(response.body.msg).to.equal('Method Not Found');
          });
      });
      it('/:comment_id PATCH:200 Returns unchanged comment when passed no inc_votes on request body', () => {
        return request(app)
          .patch('/api/comments/1')
          .send({})
          .expect(200)
          .then(response => {
            expect(response.body.comment.votes).to.equal(16);
          })
      });
      it('/:comment_id PATCH:200 Returns unchanged comment when passed no inc_votes on request body', () => {
        return request(app)
          .put('/api/comments/1')
          .send({ user: 'butter_bridge' })
          .expect(405)
          .then(response => {
            expect(response.body.msg).to.equal("Method Not Found");
          });
      });
      it('/:comment_id GET:200 Returns comments sorted by votes', () => {
        return request(app)
          .get('/api/comments?sort_by=votes')
          .expect(200)
          .then(response => {
            expect(response.body.comments[0].votes).to.equal(100);
          });
      });
    });
  });
});


