const express = require('express');
const app = express();
const apiRouter = require('./routers/apiRouter.js')

app.use('/api', apiRouter);

// Error Handlers

app.use((err, req, res, next) => {
  const { path } = req.route;

  if (err.status === 404 && path === '/:username') {
    res.status(404).send({ msg: 'User does not exist' });
  } else {
    next(err)
  }
})

app.use((err, req, res, next) => {
  const { path } = req.route;

  if (err.status === 404 && path === '/:article_id') {
    res.status(404).send({ msg: 'Article does not exist' });
  } else {
    next(err)
  }
})

module.exports = app;