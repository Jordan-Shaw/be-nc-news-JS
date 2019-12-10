const { fetchTopics } = require('../models/topics-m.js')

exports.getTopics = (req, res, next) => {
  console.log('reached getTopics controller...')
  fetchTopics()
    .then(topics => {
      res.status(200).send(topics);
    })
    .catch((err) => {
      next(err)
    });
}