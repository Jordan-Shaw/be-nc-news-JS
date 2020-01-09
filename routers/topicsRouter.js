const topicsRouter = require('express').Router();
const { getTopics } = require('../controllers/topics-c.js');
const { send405 } = require('./utils-r');


topicsRouter.route('/')
  .get(getTopics)
  .all(send405)


module.exports = topicsRouter;