const commentsRouter = require('express').Router();
const { patchComment, deleteComment, getAllComments: getAllComments } = require('../controllers/comments-c.js');
const { send405 } = require('./utils-r');

commentsRouter.route('/:comment_id')
  .patch(patchComment)
  .delete(deleteComment)
  .all(send405)


commentsRouter.route('/')
  .get(getAllComments)
  .all(send405);

module.exports = commentsRouter;