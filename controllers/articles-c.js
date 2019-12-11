const { fetchArticle, updateArticle, fetchComments, addComment } = require('../models/articles-m.js')

exports.getArticle = (req, res, next) => {
  // console.log('Made it to getArticle...');
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
  // console.log("Made it to the patchArticle controller")
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

exports.getComments = (req, res, next) => {
  // console.log('Made it to getArticleComments')
  const { article_id } = req.params;
  fetchComments(article_id)
    .then(comments => {
      res.status(200).send(comments);
    })
    .catch((err) => {
      next(err);
    })
}

exports.postComment = (req, res, next) => {
  // console.log('Made it to postComment');
  const { article_id } = req.params;
  const comment = req.body;

  addComment(article_id, comment)
    .then(comment => {
      res.status(200).send(comment);
    })
    .catch(err => {
      next(err)
    })
}