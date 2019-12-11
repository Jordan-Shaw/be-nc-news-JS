const knextion = require('../db/connection.js')

exports.fetchArticle = (article_id) => {
  // console.log('Made it to fetchArticle...')
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

  if (Object.keys(updateData).length > 1) {
    return Promise.reject({ status: 400, msg: "Invalid properties in request" })
  } else if (!inc_votes) {
    return Promise.reject({
      status: 400, msg: 'Number of votes to add not passed'
    })
  } else if (typeof inc_votes !== 'number') {
    return Promise.reject({ status: 400, msg: 'Invalid number of votes to add' })
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
  // console.log('Made it to  fetchArticleComments');
  return knextion('comments')
    .where('article_id', '=', article_id)
    .select('author', 'body', 'comment_id', 'created_at', 'votes')
    .then(comments => {
      // console.log(comments);
      comments = { comments: comments };
      // ^ puts response in correct format

      //could make two requests, the first to 'articles' to see if the article is in the database, and if it is to do the second request for the comments. but that seems really inefficient 

      //could join the articles and comments tables? Maybe do it that way...



      // if (!comments.comments) {
      //   return Promise.reject({ status: 404, msg: 'Article does not exist' })
      // }

      // ^ did it this way for the articles, but wont work here as it would stop it from returning an empty array for articles that exist but have no comments...
      return comments;
    })
}