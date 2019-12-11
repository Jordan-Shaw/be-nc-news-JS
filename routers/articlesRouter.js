const articlesRouter = require('express').Router();
const { getArticle, patchArticle, getArticleComments } = require('../controllers/articles-c.js')

articlesRouter.route('/:article_id')
  .get(getArticle)
  .patch(patchArticle);

articlesRouter.route('/:article_id/comments')
  .get(getArticleComments);

module.exports = articlesRouter