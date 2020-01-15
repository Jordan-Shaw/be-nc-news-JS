const knextion = require('../db/connection.js')

exports.updateComment = (comment_id, updateData) => {
  if (!updateData.inc_votes) { updateData.inc_votes = 0 }
  const { inc_votes } = updateData

  if (Object.keys(updateData).length > 1) {
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

exports.fetchAllComments = ({ sort_by, order }) => {
  if (!sort_by) {
    sort_by = 'created_at';
  }
  if (!order) {
    order = "asc";
  }
  if (order !== "asc" && order !== "desc") {
    return Promise.reject({ status: 400, msg: `Cannot order by ${order} - order must be asc or desc` })
  }
  return knextion
    .select('*')
    .from('comments')
    .orderBy(sort_by, order)
    .returning('*')
    .then(response => {
      return { comments: response }
    })
}