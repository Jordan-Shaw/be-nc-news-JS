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

// articles error handler
app.use((err, req, res, next) => {
  // console.log(err);
  // console.log(req.body);

  const { path } = req.route;
  const { inc_votes } = req.body

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
  } else if (err.status === 400 && !inc_votes) {
    res.status(400).send({ msg: "Number of votes to add not passed" })
  }
})

module.exports = app;