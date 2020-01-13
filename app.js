const express = require('express');
const app = express();
const apiRouter = require('./routers/apiRouter');
const { errorHandler } = require('./errorHandling');
const cors = require('cors');

app.use(cors());

app.use(express.json());

app.use('/api', apiRouter);

app.all('/*', (req, res, next) => {
  res.status(404).send({ msg: 'Route not on server' })
})


app.use((err, req, res, next) => {
  errorHandler(err, req, res, next)
})

module.exports = app;