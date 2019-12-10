const { fetchArticle } = require('../models/articles-m.js')

exports.getArticle = (req, res, next) => {
  // console.log('Made it to getByArticleId...');
  const { article_id } = req.params;

  fetchArticle(article_id)
    .then(article => {
      res.status(200).send(article);
    })
    .catch((err) => {
      next(err)
    });
}

exports.patchArticle = (req, res, next) => {
  const { article_id } = req.params;
  updateArticleId
}