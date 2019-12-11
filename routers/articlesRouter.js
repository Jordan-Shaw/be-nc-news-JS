const articlesRouter = require('express').Router();
const { getArticle, patchArticle, getComments, postComment } = require('../controllers/articles-c.js')

articlesRouter.route('/:article_id')
  .get(getArticle)
  .patch(patchArticle);

articlesRouter.route('/:article_id/comments')
  .get(getComments)
  .post(postComment);

module.exports = articlesRouter