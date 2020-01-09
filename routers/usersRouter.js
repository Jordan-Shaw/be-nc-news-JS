const usersRouter = require('express').Router();
const { getUser } = require('../controllers/users-c.js');
const { send405 } = require('./utils-r');


usersRouter.route('/:username')
  .get(getUser)
  .all(send405);

usersRouter.all('/', send405)

module.exports = usersRouter;