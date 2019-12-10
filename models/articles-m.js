const knextion = require('../db/connection.js')

exports.fetchByArticleId = (article_id) => {
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
}