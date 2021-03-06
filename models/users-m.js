const knextion = require('../db/connection.js')

exports.fetchUser = (username) => {
  return knextion('users')
    .select('*')
    .where('username', '=', username)
    .then(response => {
      const user = { user: response[0] };
      if (!user.user) {
        return Promise.reject({ status: 404, msg: "User does not exist" })
      }
      return user;
    })
}