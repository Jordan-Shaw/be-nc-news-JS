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

exports.fetchComments = (article_id) => {
  // console.log('Made it to  fetchArticleComments');
  return knextion('comments')
    .where('article_id', '=', article_id)
    .select('author', 'body', 'comment_id', 'created_at', 'votes')
    .then(comments => {
      // console.log(comments);
      comments = { comments: comments };
      if (comments.comments.length === 0) {
        return knextion('articles')
          .where('article_id', '=', article_id)
          .select('*')
          .then(articles => {
            if (articles.length === 0) {
              return Promise.reject({ status: 404, msg: 'Article does not exist' })
            } else return comments;
          })
      }
      return comments;
    })
}

exports.addComment = (article_id, comment) => {
  // console.log('Made it to addComment')
  if (!comment.username) {
    return Promise.reject({ status: 400, msg: "No username provided" })
  } else if (!comment.body) {
    return Promise.reject({ status: 400, msg: "No text provided" })
  } else if (Object.keys(comment).length > 2) {
    return Promise.reject({ status: 400, msg: "Invalid properties provided" })
  }

  comment.article_id = article_id;
  comment.author = comment.username;
  delete comment.username;

  return knextion
    .insert(comment)
    .into('comments')
    .returning(['author', 'body', 'comment_id', 'created_at', 'votes'])
    .then(comment => {
      comment = { comment: comment[0] }
      return comment;
    })

}

exports.fetchArticles = () => {
  return knextion
    .select('*')
    .from('articles')
    .then(articles => {
      articles = { articles: articles };
      return articles;
    });

}