const { fetchByUsername } = require('../models/users-m.js')

exports.getByUsername = (req, res, next) => {
  // console.log('Made it to the getByUsername controller');
  const { username } = req.params;
  fetchByUsername(username)
    .then(user => {
      res.status(200).send(user);
    })
    .catch((err) => {
      next(err);
    })
}