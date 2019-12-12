const commentsRouter = require('express').Router();
const { patchComment, deleteComment, getAllComments: getAllComments } = require('../controllers/comments-c.js')

commentsRouter.route('/:comment_id')
  .patch(patchComment)
  .delete(deleteComment)
  .all((req, res, next) => {
    res.status(405).send({ msg: "Method Not Found" })
  })


commentsRouter.route('/')
  .get(getAllComments)
  .all((req, res, next) => {
    res.status(405).send({ msg: "Method Not Found" })
  });

module.exports = commentsRouter;