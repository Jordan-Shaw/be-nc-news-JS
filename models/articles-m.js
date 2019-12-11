const knextion = require('../db/connection.js')

exports.fetchArticle = (article_id) => {
  // console.log('Made it to fetchArticleById...')
  return knextion('articles')
    .select('*')
    .where('article_id', '=', article_id)
    .then(response => {
      const article = { article: response[0] };
      if (!article.article) {
        return Promise.reject({ status: 404, msg: 'Article does not exist' })
      }
      return article;
    })
  // .catch((err) =>
  //   console.log(err))
}

exports.updateArticle = (article_id, updateData) => {
  // console.log('Made it to the updateArticle model...')
  const { inc_votes } = updateData

  if (!inc_votes || Object.keys(updateData).length > 1) {
    return Promise.reject({ status: 400 })
  }

  return knextion('articles')
    .where('article_id', '=', article_id)
    .returning('*')
    .increment('votes', inc_votes)
    .then(response => {
      const article = { article: response[0] };
      return article;
    })
}

exports.fetchArticleComments = (article_id) => {
  return knextion('comments')
    .where('article_id', '=', article_id)
    .select('author', 'body', 'comment_id', 'created_at', 'votes')
    .then(comments => {
      comments = { comments: comments };
      return comments;
    })
}