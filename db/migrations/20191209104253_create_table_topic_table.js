
exports.up = function (knex) {
  // console.log('Creating topics table...');
  return knex.schema.createTable('topics', (topicsTable) => {
    topicsTable.string('slug')
      .unique()
      .primary(); // .unique() unnecessary with .primary() called? - slug = topic name
    topicsTable.string('description').notNullable(); //.text more appropriate?
  })
};

exports.down = function (knex) {
  // console.log('Removing topics table');
  return knex.schema.dropTable('topics');
};
