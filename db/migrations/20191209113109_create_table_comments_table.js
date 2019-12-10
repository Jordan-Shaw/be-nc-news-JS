
exports.up = function (knex) {
  // console.log('Creating comments table...');
  return knex.schema.createTable('comments', (commentsTable) => {
    commentsTable.increments('comment_id').primary();
    commentsTable.string('author').references('users.username');
    commentsTable.integer('article_id').references('articles.article_id');
    commentsTable.integer('votes').defaultTo(0);
    commentsTable.timestamp('created_at', { precision: 6 }).defaultTo(knex.fn.now(6));
    commentsTable.string('body', 750);
  })
};

exports.down = function (knex) {
  // console.log('Removing comments table...');
  return knex.schema.dropTable('comments');
};
