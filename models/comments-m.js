const knextion = require('../db/connection.js')

exports.updateComment = (comment_id, updateData) => {
  // console.log('Made it to updateComment');
  const { inc_votes } = updateData
  return knextion('comments')
    .where('comment_id', '=', comment_id)
    .increment('votes', inc_votes)
    .returning('*')
    .then(response => {
      response = { comment: response[0] };
      delete response.comment.article_id;
      return response;
    })
}