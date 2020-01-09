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

exports.errorHandler = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    complexErrorHandler(err, req, res, next)
  }
}

const complexErrorHandler = (err, req, res, next) => {
  const psqlErrors = {
    "22P02": "Invalid ID provided",
    "23503": {
      "author": "Incorrect username provided",
      "article_id": "Article does not exist"
    },
    "42703": `Cannot sort by ${req.query.sort_by} - ${req.query.sort_by} column does not exist`
  };
  if (err.code === "23503") {
    res.status(404).send({ msg: psqlErrors[err.code][err.problem] })
  } else {
    res.status(400).send({ msg: psqlErrors[err.code] })
  }
}

exports.send405 = (req, res, next) => {
  res.status(405).send({ msg: "Method Not Found" })
}