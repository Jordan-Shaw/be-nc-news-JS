# NC News

## Background

This project is a Node.js Express application using a RESTful API to serve data from a PSQL database, with interaction being handled by [Knex](https://knexjs.org). 

A hosted version of this project can be found [here](https://nc-news-js.herokuapp.com/api/)

## Getting Started
### Prerequisites
This project requires [npm](https://www.npmjs.com/get-npm)(v6.13.12 or newer), [PostgreSQL](https://www.postgresql.org/) (v10.10 or newer), and [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) (v2.17.1 or newer) to run. Install if necessary.

### Installing
1. Fork this repo and clone it onto your machine.

```bash
git clone https://github.com/${username}/be-nc-news-JS.git

cd be-nc-news-JS
```

2.  Run the following command in your terminal to install the project's dependencies:

```bash
npm install
```

3. Create a knexfile.js in the root directory using the following code:
```js
const { DB_URL } = process.env;

const ENV = process.env.NODE_ENV || 'development';

const baseConfig = {
  client: 'pg',
  migrations: {
    directory: './db/migrations'
  },
  seeds: {
    directory: './db/seeds'
  }
};

const customConfig = {
  development: {
    connection: {
      database: 'nc_news'
      // if using Linux, enter your username and password here"
      // username: 'yourUsername'
      // password: 'yourPassword'
    }
  },
  test: {
    connection: {
      database: 'nc_news_test'
      // if using Linux, enter your username and password here"
      // username: 'yourUsername'
      // password: 'yourPassword'
    }
  },
  production: {
    connection: `${DB_URL}?ssl=true`,
  },
};

module.exports = { ...customConfig[ENV], ...baseConfig };
```

4. Make sure everything is functioning correctly:
```bash
# Setup the test database and seed it with test data:

npm run seed-test 

# Run the tests

npm test
```

5. Setup the dev database and seed with data
```bash
npm run seed
```

6. Now the server can be ran locally. To do this, use the following command:

```bash
npm start
```

The server is now listening for requests on port 9090.

## Routes
A list of available endpoints with descriptions can be seen in the endpoints.json file. Alternatively, once the server is listening this file can be seen by making a GET request to '/api'

---

