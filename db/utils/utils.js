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

exports.makeRefObj = list => { };

exports.formatComments = (comments, articleRef) => { };
