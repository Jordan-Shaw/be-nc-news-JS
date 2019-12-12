const commentsRouter = require('express').Router();
const { patchComment, deleteComment, getAllComments: getAllComments } = require('../controllers/comments-c.js')

commentsRouter.route('/:comment_id')
  .patch(patchComment)
  .delete(deleteComment)

commentsRouter.route('/')
  .get(getAllComments);
module.exports = commentsRouter;