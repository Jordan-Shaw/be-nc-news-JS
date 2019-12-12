const commentsRouter = require('express').Router();
const { patchComment, deleteComment, getComments } = require('../controllers/comments-c.js')

commentsRouter.route('/:comment_id')
  .patch(patchComment)
  .delete(deleteComment)

commentsRouter.route('/')
  .get(getComments);
module.exports = commentsRouter;