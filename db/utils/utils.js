exports.formatDates = list => {
  const copiedArr = [...list];
  const outputArr = [];

  copiedArr.forEach(article => outputArr.push({ ...article }))

  outputArr.forEach(article => {
    article['created_at'] = new Date(article['created_at']);
  });
  // console.log(outputArr);
  // console.log(typeof (outputArr));
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

exports.errorDetialSlicer = (err) => {
  const sliceIndex = err.detail.indexOf(')');
  err.problem = err.detail.slice(5, sliceIndex);
  return err;
}
