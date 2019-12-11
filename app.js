const express = require('express');
const app = express();
const apiRouter = require('./routers/apiRouter.js')

app.use(express.json());

app.use('/api', apiRouter);

// Error Handlers

// generic error handler
app.use((err, req, res, next) => {
  const { path } = req.route;

  if (!err.status) {
    next(err)
  }
  res.status(err.status).send({ msg: err.msg });
})

// PSQL error handler
app.use((err, req, res, next) => {
  const { inc_votes } = req.body
  const psqlErrors = {
    "22P02": "Invalid Article ID"
  };

  if (err.code === '22P02') {
    res.status(400).send({ msg: psqlErrors[err.code] })
  }
})

module.exports = app;