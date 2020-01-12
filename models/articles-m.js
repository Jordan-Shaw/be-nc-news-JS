const knextion = require('../db/connection.js')
const { checkTopic, checkAuthor } = require('../db/utils/utils.js')

exports.fetchArticle = (article_id) => {
  return knextion
    .select('articles.*')
    .from(('articles'))
    .where('articles.article_id', '=', article_id)
    .leftJoin('comments', 'articles.article_id', '=', 'comments.article_id')
    .count('comment_id', { as: 'comment_count' })
    .groupBy('articles.article_id')
    .then(response => {
      const article = { article: response[0] };
      if (!article.article) {
        return Promise.reject({ status: 404, msg: 'Article does not exist' })
      }
      return article;
    })
}

exports.updateArticle = (article_id, updateData) => {
  if (!updateData.inc_votes) {
    updateData.inc_votes = 0;
  }
  const { inc_votes } = updateData

  if (Object.keys(updateData).length > 1) {
    return Promise.reject({ status: 400, msg: "Invalid properties in request" })
  } else if (typeof inc_votes !== 'number') {
    return Promise.reject({ status: 400, msg: 'Invalid number of votes to add' })
  }


  return knextion('articles')
    .where('article_id', '=', article_id)
    .returning('*')
    .increment('votes', inc_votes)
    .then(response => {
      const article = { article: response[0] };
      if (!article.article) {
        return Promise.reject({ status: 404, msg: "Article does not exist" })
      } else {
        return article;
      }
    })
}

exports.fetchComments = (article_id, { sort_by, order }) => {
  if (!sort_by) {
    sort_by = 'created_at'
  }
  if (!order) {
    order = 'desc'
  }

  return knextion('comments')
    .where('article_id', '=', article_id)
    .select('author', 'body', 'comment_id', 'created_at', 'votes')
    .orderBy(sort_by, order)
    .then(comments => {
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

exports.fetchArticles = ({ sort_by, order, author, topic }) => {
  if (!sort_by) {
    sort_by = 'created_at';
  }
  if (!order) {
    order = "desc";
  }
  if (order !== "asc" && order !== "desc") {
    return Promise.reject({ status: 400, msg: `Cannot order by ${order} - order must be asc or desc` })
  }
  const getTheArticles = knextion
    .select('articles.author', 'articles.title', 'articles.article_id', 'articles.topic', 'articles.created_at', 'articles.votes')
    .from('articles')
    .orderBy(sort_by, order)
    .leftJoin('comments', 'articles.article_id', '=', 'comments.article_id')
    .count('comment_id', { as: 'comment_count' })
    .groupBy('articles.article_id')
    .modify((query) => {
      if (author) {
        query.where('articles.author', '=', author)
      }
      if (topic) {
        query.where({ topic });
      }
    })
    .returning(['author', 'title', 'article_id', 'topic', 'created_at', 'votes', 'comment_count'])
    .then(response => {
      response = { articles: response };
      return response;
    });

  const authorPromise = checkAuthor(author);
  const topicPromise = checkTopic(topic)

  return Promise.all([getTheArticles, authorPromise, topicPromise]).then(([getTheArticles, checkAuthor, checkTopic]) => {
    if (checkAuthor && checkTopic) {
      return getTheArticles;
    }
  })
}