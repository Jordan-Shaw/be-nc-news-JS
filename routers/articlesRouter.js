const articlesRouter = require('express').Router();
const { getByArticleId } = require('../controllers/articles-c.js')

articlesRouter.get('/:article_id', getByArticleId);

module.exports = articlesRouter