const knextion = require('../connection.js')

exports.formatDates = list => {
  return list.map(article => {
    return { ...article, created_at: new Date(article['created_at']) }
  })
};

exports.makeRefObj = list => {
  const refObj = {};

  list.forEach(item => {
    refObj[item.title] = item.article_id
  });

  return refObj;
};

exports.formatComments = (comments, articleRef) => {
  return comments.map(comment => {
    return { body: comment.body, author: comment.created_by, votes: comment.votes, created_at: new Date(comment.created_at), article_id: articleRef[comment.belongs_to] };
  })

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