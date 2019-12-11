const { fetchArticle, updateArticle, fetchArticleComments } = require('../models/articles-m.js')

exports.getArticle = (req, res, next) => {
  // console.log('Made it to getByArticleId...');
  const { article_id } = req.params;

  fetchArticle(article_id)
    .then(article => {
      res.status(200).send(article);
    })
    .catch(err => {
      next(err);
    });
}

exports.patchArticle = (req, res, next) => {
  // console.log("Made it to the patch article controller")
  const { article_id } = req.params;
  const updateData = req.body;

  updateArticle(article_id, updateData)
    .then(article => {
      res.status(200).send(article);
    })
    .catch(err => {
      next(err);
    });
}

exports.getArticleComments = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleComments(article_id)
    .then(comments => {
      res.status(200).send(comments);
    })
    .catch((err) => {
      next(err);
    })
}