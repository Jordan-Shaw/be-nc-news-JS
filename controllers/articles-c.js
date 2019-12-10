const { fetchByArticleId } = require('../models/articles-m.js')

exports.getByArticleId = (req, res, next) => {
  // console.log('Made it to getByArticleId...');
  const { article_id } = req.params;
  fetchByArticleId(article_id)
    .then(article => {
      res.status(200).send(article);
    })
    .catch((err) => {
      next(err)
    });
}