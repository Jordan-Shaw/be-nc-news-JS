const articlesRouter = require('express').Router();
const { getArticle, patchArticle, getComments, postComment, getArticles } = require('../controllers/articles-c.js')

articlesRouter.route('/')
  .get(getArticles)
  .all((req, res, next) => {
    res.status(405).send({ msg: "Method Not Found" });
  });

articlesRouter.route('/:article_id')
  .get(getArticle)
  .patch(patchArticle)
  .all((req, res, next) => {
    res.status(405).send({ msg: "Method Not Found" });
  })

articlesRouter.route('/:article_id/comments')
  .get(getComments)
  .post(postComment)
  .all((req, res, next) => {
    res.status(405).send({ msg: "Method Not Found" });
  });


module.exports = articlesRouter