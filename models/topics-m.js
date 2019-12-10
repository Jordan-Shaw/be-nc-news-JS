const knextion = require('../db/connection.js')

exports.fetchTopics = () => {
  // console.log('reached the fetchTopics model')
  return knextion('topics')
    .select('*')
}