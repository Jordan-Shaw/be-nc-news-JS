const express = require('express');
const app = express();
const apiRouter = require('./routers/apiRouter.js')

app.use(express.json());

app.use('/api', apiRouter);

// Error Handlers

// username error handler
app.use((err, req, res, next) => {
  const { path } = req.route;

  if (path !== '/:username') {
    next(err)
  }
  if (err.status === 404) {
    res.status(404).send({ msg: 'User does not exist' });
  }
})

// articles generic error handler
app.use((err, req, res, next) => {
  const { path } = req.route;
  const { inc_votes } = req.body;
  const paramsCount = Object.keys(req.body).length;

  if (path !== '/:article_id') {
    next(err)
  }

  if (err.status === 404) {
    res.status(404).send({ msg: 'Article does not exist' }); //Article_id is valid but doesn't exist
  } else if (err.status === 400 && !inc_votes) {
    res.status(400).send({ msg: "Number of votes to add not passed" }); // patch article, no votes passed
  } else if (err.status === 400 && paramsCount > 1) {
    res.status(400).send({
      msg: "Invalid properties in request"
    }); // patch article, arguments other than inc_votes passed
  } else {
    next(err);
  }
})

// articles PSQL error handler
app.use((err, req, res, next) => {
  const { inc_votes } = req.body
  const psqlErrors = {
    "22P02": "Invalid Article ID"
  };

  if (err.code === '22P02' && inc_votes !== undefined && typeof inc_votes !== Number) {
    res.status(400).send({ msg: "Invalid number of votes to add" }) // patch article, inc_votes passed but given invalid value
  } else if (err.code === '22P02') {
    res.status(400).send({ msg: psqlErrors[err.code] }) // get article, invalid article id endpoint
  }
})

module.exports = app;