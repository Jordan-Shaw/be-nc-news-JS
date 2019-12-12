const topicsRouter = require('express').Router();
const { getTopics } = require('../controllers/topics-c.js');

topicsRouter.route('/')
  .get(getTopics)

topicsRouter.all('/', (req, res, next) => {
  res.status(405).send({ msg: "Method Not Found" })
});

module.exports = topicsRouter;