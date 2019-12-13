const knextion = require('../db/connection.js')

exports.fetchTopics = () => {
  return knextion('topics')
    .select('*')
    .then(topics => {
      return { topics };
    })
}