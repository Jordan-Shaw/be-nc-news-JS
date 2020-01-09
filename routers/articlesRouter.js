const articlesRouter = require('express').Router();
const { getArticle, patchArticle, getComments, postComment, getArticles } = require('../controllers/articles-c.js')
const { send405 } = require('./utils-r')


articlesRouter.route('/')
  .get(getArticles)
  .all(send405);

articlesRouter.route('/:article_id')
  .get(getArticle)
  .patch(patchArticle)
  .all(send405)

articlesRouter.route('/:article_id/comments')
  .get(getComments)
  .post(postComment)
  .all(send405);


module.exports = articlesRouter