const usersRouter = require('express').Router();
const { getByUsername } = require('../controllers/users-c.js')

usersRouter.route('/:username')
  .get(getByUsername)
  .all((req, res, next) => {
    res.status(405).send({ msg: "Method Not Found" })
  })

usersRouter.all('/', (req, res, next) => {
  res.status(405).send({ msg: "Method Not Found" })
})

module.exports = usersRouter;