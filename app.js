const express = require('express');
const app = express();
const apiRouter = require('./routers/apiRouter.js')

app.use(express.json());

app.use('/api', apiRouter);

// Error Handlers

// generic error handler
app.use((err, req, res, next) => {
  // console.log(err);

  if (!err.status) {
    next(err)
  }
  res.status(err.status).send({ msg: err.msg });
})

// PSQL error handler
app.use((err, req, res, next) => {
  const sliceIndex = err.detail.indexOf(')');
  err.problem = err.detail.slice(5, sliceIndex);

  console.log(err);

  const psqlErrors = {
    "22P02": "Invalid Article ID",
    "23503": {
      "author": "Incorrect username provided", "article_id": "Article does not exist"
    }
  };
  if (err.code === "23503") {
    res.status(404).send({ msg: psqlErrors[err.code][err.problem] })
  } else {
    res.status(400).send({ msg: psqlErrors[err.code] })
  }
})

module.exports = app;