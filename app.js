const express = require('express');
const app = express();
const apiRouter = require('./routers/apiRouter.js')

app.use('/api', apiRouter);

// Error Handlers

app.use((err, req, res, next) => {
  const { path } = req.route;

  if (path !== '/:username') {
    next(err)
  }
  if (err.status === 404) {
    res.status(404).send({ msg: 'User does not exist' });
  }
})

app.use((err, req, res, next) => {
  const { path } = req.route;
  const psqlErrors = {
    "22P02": "Invalid ID"
  };

  if (path !== '/:article_id') {
    next(err)
  }

  if (err.status === 404) {
    res.status(404).send({ msg: 'Article does not exist' });
  } else if (err.code === '22P02') {
    res.status(400).send({ msg: psqlErrors[err.code] })
  }
})

module.exports = app;