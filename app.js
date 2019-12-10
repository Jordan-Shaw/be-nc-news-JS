const express = require('express');
const app = express();
const apiRouter = require('./routers/apiRouter.js')

app.use('/api', apiRouter);

app.use((err, res, req, next) => {
  console.log(err);
})

module.exports = app;