const knextion = require('../db/connection.js')

exports.fetchByArticleId = (article_id) => {
  // console.log('Made it to fetchArticleById...')
  return knextion('articles')
    .select('*')
    .where('article_id', '=', article_id)
    .then(article => {
      return { article: article[0] };
    })
}