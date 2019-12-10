const express = require('express');
const app = express();
const apiRouter = require('./routers/apiRouter.js')

app.use('/api', apiRouter);

app.use((err, req, res, next) => {
  // if (err.msg === 'User does not exist') {
  //   res.status(404).send({msg: 'User does not exist'})
  // }
  if (err.status === 404) {
    res.status(404).send({ msg: 'User does not exist' });
  }
})

module.exports = app;