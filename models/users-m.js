const knextion = require('../db/connection.js')

exports.fetchByUsername = (username) => {
  console.log('Made it to the fetchByUsername model')
  return knextion('users')
    .select('*')
    .where('username', '=', username);
}