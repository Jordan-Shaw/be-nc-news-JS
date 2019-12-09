
exports.up = function (knex) {
  console.log('Creating users table...');
  return knex.schema.createTable('users', (usersTable) => {
    usersTable.string('username').primary();
    usersTable.string('avatar_url');
    usersTable.string('name');
  })
};

exports.down = function (knex) {
  console.log('Removing users table...');
  return knex.dropTable('users');
};
