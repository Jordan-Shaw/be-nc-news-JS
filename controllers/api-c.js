const apiObj = require('../endpoints.json')

exports.getAPI = (req, res, next) => {
  res.status(200)
    .send(apiObj)
  // .catch(err => {
  //   next(err);
  // })
}