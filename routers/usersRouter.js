const usersRouter = require('express').Router();
const { getByUsername } = require('../controllers/users-c.js')

usersRouter.get('/:username', getByUsername);

module.exports = usersRouter;