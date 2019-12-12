const { updateComment, removeComment, fetchAllComments } = require('../models/comments-m.js')

exports.patchComment = (req, res, next) => {
  const { comment_id } = req.params;
  const updateData = req.body;

  updateComment(comment_id, updateData)
    .then(comment => {
      res.status(200).send(comment);
    })
    .catch(err => {
      next(err)
    });
}

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  removeComment(comment_id)
    .then(response => {
      res.sendStatus(204);
    })
    .catch(err => {
      next(err);
    })
}

exports.getAllComments = (req, res, next) => {
  const { query } = req;
  fetchAllComments(query)
    .then(response => {
      res.status(200).send(response);
    })
    .catch(err => {
      next(err);
    })
}