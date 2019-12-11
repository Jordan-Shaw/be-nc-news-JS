const commentsRouter = require('express').Router();
const { patchComment } = require('../controllers/comments-c.js')

commentsRouter.route('/:comment_id')
  .patch(patchComment);

module.exports = commentsRouter;