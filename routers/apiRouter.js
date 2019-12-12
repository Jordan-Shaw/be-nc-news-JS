const apiRouter = require('express').Router();
const topicsRouter = require('./topicsRouter.js');
const usersRouter = require('./usersRouter.js');
const articlesRouter = require('./articlesRouter.js');
const commentsRouter = require('./commentsRouter.js')



apiRouter.use('/topics', topicsRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/comments', commentsRouter);
apiRouter.route('/')
  .all((req, res, next) => {
    res.status(405).send({ msg: "Method Not Found" })
  });

module.exports = apiRouter;