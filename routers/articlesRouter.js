const articlesRouter = require('express').Router();
const { getArticle, patchArticle, getComments, postComment, getArticles } = require('../controllers/articles-c.js')

articlesRouter.route('/')
  .get(getArticles);

articlesRouter.route('/:article_id')
  .get(getArticle)
  .patch(patchArticle);

articlesRouter.route('/:article_id/comments')
  .get(getComments)
  .post(postComment);

module.exports = articlesRouter