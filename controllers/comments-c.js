const { updateComment } = require('../models/comments-m.js')

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