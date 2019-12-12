const { updateComment, removeComment, fetchComments } = require('../models/comments-m.js')

exports.patchComment = (req, res, next) => {
  // console.log('Made it to patchComment');
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
  // console.log('made it to delete comment');
  const { comment_id } = req.params;
  removeComment(comment_id)
    .then(response => {
      res.sendStatus(204);
    })
    .catch(err => {
      next(err);
    })
}

exports.getComments = (req, res, next) => {
  // console.log('Made it to getComments')
  fetchComments()
    .then(response => {
      res.status(200).send(response);
    })
    .catch(err => {
      next(err);
    })
}