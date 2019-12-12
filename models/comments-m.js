const knextion = require('../db/connection.js')

exports.updateComment = (comment_id, updateData) => {
  // console.log('Made it to updateComment');
  const { inc_votes } = updateData
  if (!inc_votes) {
    return Promise.reject({ status: 400, msg: "Number of votes to add not passed" })
  } else if (Object.keys(updateData).length > 1) {
    return Promise.reject({ status: 400, msg: 'Invalid properties in request' })
  } else if (typeof inc_votes !== 'number') {
    return Promise.reject({ status: 400, msg: 'Invalid number of votes to add' })
  }

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

exports.fetchAllComments = () => {
  // console.log('made it to fetchComments')
  return knextion
    .select('*')
    .from('comments')
    .returning('*')
    .then(response => {
      return { comments: response }
    })
}