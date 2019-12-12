const { fetchArticle, updateArticle, fetchComments, addComment, fetchArticles } = require('../models/articles-m.js')
const errorDetailSlicer = require('../db/utils/utils.js')

exports.getArticle = (req, res, next) => {
  const { article_id } = req.params;

  fetchArticle(article_id)
    .then(article => {
      res.status(200).send(article);
    })
    .catch(err => {
      if (!err.detail) {
        next(err)
      } else {
        errorDetailSlicer(err);
        next(err);
      }
    });
}

exports.patchArticle = (req, res, next) => {
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
  const { article_id } = req.params;
  const { sort_by } = req.query;

  fetchComments(article_id, sort_by)
    .then(comments => {
      res.status(200).send(comments);
    })
    .catch((err) => {
      next(err);
    })
}

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const comment = req.body;

  addComment(article_id, comment)
    .then(comment => {
      res.status(200).send(comment);
    })
    .catch(err => {
      if (!err.detail) {
        next(err);
      } else {
        const sliceIndex = err.detail.indexOf(')');
        err.problem = err.detail.slice(5, sliceIndex);
        next(err)
      }
    })
}

exports.getArticles = (req, res, next) => {
  const { query } = req;
  fetchArticles(query)
    .then(response => {
      res.status(200).send(response);
    })
    .catch(err => {
      next(err);
    })
}