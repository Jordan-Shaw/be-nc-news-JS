const usersRouter = require('express').Router();
const { getUser } = require('../controllers/users-c.js')

usersRouter.route('/:username')
  .get(getUser)
  .all((req, res, next) => {
    res.status(405).send({ msg: "Method Not Found" })
  })

usersRouter.all('/', (req, res, next) => {
  res.status(405).send({ msg: "Method Not Found" })
})

module.exports = usersRouter;