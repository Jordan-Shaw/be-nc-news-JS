const apiRouter = require('express').Router();
const topicsRouter = require('./topicsRouter.js');
const usersRouter = require('./usersRouter.js');
const articlesRouter = require('./articlesRouter.js');
const commentsRouter = require('./commentsRouter.js')
const { getAPI } = require('../controllers/api-c.js')
const { send405 } = require('./utils-r')

apiRouter.use('/topics', topicsRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/comments', commentsRouter);
apiRouter.route('/')
  .get(getAPI)
  .all(send405);

module.exports = apiRouter;