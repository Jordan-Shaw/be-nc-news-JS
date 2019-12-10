const knex = require('knex');
const config = require('../knexfile.js');

const knextion = knex(config);

module.exports = knextion;