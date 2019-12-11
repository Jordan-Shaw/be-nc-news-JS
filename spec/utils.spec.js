const { expect } = require('chai');
const {
  formatDates,
  makeRefObj,
  formatComments,
  errorDetialSlicer
} = require('../db/utils/utils');

let articleData = require('../db/data/test-data/articles.js');
let individualArticle = [articleData[0]]
const output = formatDates(individualArticle);


describe('formatDates', () => {
  it('Should return an array', () => {
    expect(output).to.be.an('Array');
  });
  it('Should return an entirely new array and the original array should not be mutated', () => {
    expect(output).to.not.equal(individualArticle);
    expect(individualArticle).to.deep.equal([
      {
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: 1542284514171,
        votes: 100
      }
    ])
  });
  it('Should return an array of objects', () => {
    expect(output[0]).to.be.an('Object');
  })
  it('Returned objects should be new i.e. should have a new reference', () => {
    expect(output[0]).to.not.equal(individualArticle[0]);
    expect(individualArticle[0]).to.deep.equal({
      title: 'Living in the shadow of a great man',
      topic: 'mitch',
      author: 'butter_bridge',
      body: 'I find this existence challenging',
      created_at: 1542284514171,
      votes: 100
    })
  })
  it('Returned objects in array should retain all correct keys', () => {
    expect(output[0]).to.have.keys('title', 'topic', 'author', 'body', 'created_at', 'votes');
  })
  it('The value of the created_at property of returned objects in the array should date objects', () => {
    expect(output[0]['created_at'] instanceof Date).to.equal(true);
  });
  it("created_at property of returned objects should be in the format:`$(Weekday), $(Date) $(Time)`", () => {
    expect(output[0]['created_at']).to.deep.equal(new Date(1542284514171));
  })
  it('Should function correctly with more than one object\'s created_at property to convert', () => {
    const output2 = formatDates(articleData);
    expect(output2[0].title).to.equal('Living in the shadow of a great man');
    expect(output2[0]['created_at']).to.deep.equal(new Date(1542284514171));
    expect(output2[1].title).to.equal('Sony Vaio; or, The Laptop');
    expect(output2[1]['created_at']).to.deep.equal(new Date(1416140514171))
  })
})

const inputArr = [{ article_id: 1, title: 'A' }];
const exemplarArticles = [
  {
    title: 'Living in the shadow of a great man',
    topic: 'mitch',
    author: 'butter_bridge',
    body: 'I find this existence challenging',
    created_at: 1542284514171,
    votes: 100,
    article_id: 1
  },
  {
    title: 'Sony Vaio; or, The Laptop',
    topic: 'mitch',
    author: 'icellusedkars',
    body:
      'Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.',
    created_at: 1416140514171,
    article_id: 2
  },
  {
    title: 'Eight pug gifs that remind me of mitch',
    topic: 'mitch',
    author: 'icellusedkars',
    body: 'some gifs',
    created_at: 1289996514171,
    article_id: 3
  },
  {
    title: "They're not exactly dogs, are they?",
    topic: 'mitch',
    author: 'butter_bridge',
    body: 'Well? Think about it.',
    created_at: 533132514171,
    article_id: 4
  }];

const makeRefObjOutput = makeRefObj(inputArr);


describe('makeRefObj', () => {
  it('Should return an object', () => {
    expect(makeRefObjOutput).to.be.an('Object');
  });
  it('Should be keyed by the item\'s title', () => {
    expect(makeRefObjOutput).to.have.key('A');
  })
  it('Value of the keys should be equal to the item\'s id', () => {
    expect(makeRefObjOutput.A).to.equal(1);
  })
  it('Should perform correctly with multiple large objects', () => {
    const complexOutput = makeRefObj(exemplarArticles);
    expect(complexOutput).to.deep.equal({
      'Living in the shadow of a great man': 1,
      'Sony Vaio; or, The Laptop': 2,
      'Eight pug gifs that remind me of mitch': 3,
      "They're not exactly dogs, are they?": 4
    })
  })
});

const exemplarRefObj = makeRefObj(exemplarArticles);
const exemplarComments = [{
  body:
    "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
  belongs_to: "They're not exactly dogs, are they?",
  created_by: 'butter_bridge',
  votes: 16,
  created_at: 1511354163389,
},
{
  body:
    'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
  belongs_to: 'Living in the shadow of a great man',
  created_by: 'butter_bridge',
  votes: 14,
  created_at: 1479818163389,
},
{
  body:
    'Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.',
  belongs_to: 'Living in the shadow of a great man',
  created_by: 'icellusedkars',
  votes: 100,
  created_at: 1448282163389,
}];

const commentsOutput = formatComments(exemplarComments, exemplarRefObj);

describe('formatComments', () => {
  it('Should return an array', () => {
    expect(commentsOutput).to.be.an('Array');
  })
  it('Should be an array of objects', () => {
    expect(commentsOutput[0]).to.an('object');
  })
  it('Should be an entirely new array with entirely new objects', () => {
    expect(commentsOutput).to.not.equal(exemplarComments);
    expect(exemplarComments).to.eql([{
      body:
        "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
      belongs_to: "They're not exactly dogs, are they?",
      created_by: 'butter_bridge',
      votes: 16,
      created_at: 1511354163389,
    },
    {
      body:
        'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
      belongs_to: 'Living in the shadow of a great man',
      created_by: 'butter_bridge',
      votes: 14,
      created_at: 1479818163389,
    },
    {
      body:
        'Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.',
      belongs_to: 'Living in the shadow of a great man',
      created_by: 'icellusedkars',
      votes: 100,
      created_at: 1448282163389,
    }]);
    expect(commentsOutput[0]).to.not.equal(exemplarComments[0]);
    expect(exemplarComments[0]).to.eql({
      body:
        "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
      belongs_to: "They're not exactly dogs, are they?",
      created_by: 'butter_bridge',
      votes: 16,
      created_at: 1511354163389,
    })
  })
  it('created_by should be renamed to author and belongs_to should be renamed to article_id in each object', () => {
    expect(commentsOutput[0]).to.have.keys('author', 'article_id', 'body', 'created_at', 'votes');
    expect(commentsOutput[0]).to.not.have.keys('created_by', 'belongs_to');
  })
  it('The created_at value should be converted into a javascript date object', () => {
    expect(commentsOutput[0].created_at instanceof Date).to.equal(true);
  })
  it('value of the new article_id key must be the corresponding id to the original title value provided.', () => {
    expect(commentsOutput[0].article_id).to.equal(4)
  });
});

let exemplarError = {
  name: 'error',
  length: 275,
  severity: 'ERROR',
  code: '23503',
  detail: 'Key (article_id)=(9999) is not present in table "articles".',
  hint: undefined,
  position: undefined,
  internalPosition: undefined,
  internalQuery: undefined,
  where: undefined,
  schema: 'public',
  table: 'comments',
  column: undefined,
  dataType: undefined,
  constraint: 'comments_article_id_foreign',
  file: 'ri_triggers.c',
  line: '2474',
  routine: 'ri_ReportViolation',
  problem: 'article_id'
};

describe('errorDetailSlicer()', () => {
  it('Should set a new property on an error called \'problem\'', () => {
    const updatedError = errorDetialSlicer(exemplarError);
    expect(updatedError).to.have.property('problem');
  });
  it('Should set the value of that property to what is contained within the first set of parentheses in the err.detail property', () => {
    const updatedError = errorDetialSlicer(exemplarError);
    expect(updatedError.problem).to.equal('article_id');
  })
});
