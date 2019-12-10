const topicsRouter = require('express').Router();
const { getTopics } = require('../controllers/topics-c.js');

topicsRouter.route('/')
  .get(getTopics);

module.exports = topicsRouter;