const knextion = require('../db/connection.js')

exports.updateComment = (comment_id, updateData) => {
  // console.log('Made it to updateComment');
  const { inc_votes } = updateData
  return knextion('comments')
    .where('comment_id', '=', comment_id)
    .increment('votes', inc_votes)
    .returning('*')
    .then(response => {
      if (response.length === 0) {
        return Promise.reject({ status: 404, msg: "Comment does not exist" });
      } else {
        response = { comment: response[0] };
        delete response.comment.article_id;
        return response;
      }

    })
}

exports.removeComment = (comment_id) => {
  // console.log('Made it to removeComment');
  return knextion
    .select('*')
    .from('comments')
    .returning('*')
    .where('comment_id', '=', comment_id)
    .then(response => {
      if (response.length === 0) {
        return Promise.reject({ status: 404, msg: "Comment does not exist" })
      } else {
        return knextion('comments')
          .where('comment_id', '=', comment_id)
          .del();
      };
    });
}

exports.fetchComments = () => {
  // console.log('made it to fetchComments')
  return knextion
    .select('*')
    .from('comments')
    .returning('*')
    .then(response => {
      return { comments: response }
    })
}