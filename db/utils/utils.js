const knextion = require('../connection.js')

exports.formatDates = list => {
  const copiedArr = [...list];
  const outputArr = [];

  copiedArr.forEach(article => outputArr.push({ ...article }))

  outputArr.forEach(article => {
    article['created_at'] = new Date(article['created_at']);
  });
  return outputArr;
};

exports.makeRefObj = list => {
  const refObj = {};

  list.forEach(item => {
    refObj[item.title] = item.article_id
  });

  return refObj;
};

exports.formatComments = (comments, articleRef) => {
  const copy = [...comments];
  const editedComments = []

  copy.forEach(comment => editedComments.push({ ...comment }));

  editedComments.forEach(comment => {
    comment.author = comment.created_by;
    delete comment.created_by;
    comment.article_id = comment.belongs_to;
    delete comment.belongs_to;
    comment.created_at = new Date(comment.created_at);
    comment.article_id = articleRef[comment.article_id];
  })
  return editedComments;
};

exports.checkTopic = (topic) => {
  if (!topic) {
    return true
  } else {
    return knextion
      .select('*')
      .from('topics')
      .where('slug', '=', topic)
      .then(response => {
        if (response.length === 0) {
          return Promise.reject({ status: 404, msg: `Topic ${topic} is not in the database` })
        } else { return true; }
      })
  }
}

exports.checkAuthor = (author) => {
  if (!author) {
    return true
  } else {
    return knextion
      .select('*')
      .from('users')
      .where('username', '=', author)
      .then(response => {
        if (response.length === 0) {
          return Promise.reject({ status: 404, msg: `Author ${author} is not in the database` })
        } else {
          return true;
        }
      })
  }
}