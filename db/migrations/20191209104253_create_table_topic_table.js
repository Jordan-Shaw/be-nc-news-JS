
exports.up = function (knex) {
  console.log('Creating topics table...');
  return knex.schema.createTable('topics', (topicsTable) => {
    topicsTable.string('slug').primary(); // .unique() unnecessary with .primary() called?
    topicsTable.string('description').notNullable(); //.text more appropriate?
  })
};

exports.down = function (knex) {
  console.log('Removing topics table');
  return knex.schema.dropTable('topics');
};
