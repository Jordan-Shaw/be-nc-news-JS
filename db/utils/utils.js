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

  list.forEach(item =>
    refObj[item.title] = item.article_id);

  return refObj;
};

exports.formatComments = (comments, articleRef) => { };
