const express = require('express');
const app = express();
const apiRouter = require('./routers/apiRouter.js')
const { errorHandler } = require('./db/utils/utils.js')


app.use(express.json());

app.use('/api', apiRouter);

app.all('/*', (req, res, next) => {
  res.status(404).send({ msg: 'Route not on server' })
})


app.use((err, req, res, next) => {
  errorHandler(err, req, res, next)
})

module.exports = app;