const { expect } = require('chai');
const {
  formatDates,
  makeRefObj,
  formatComments,
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
const complexInput = [
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
    title: 'Student SUES Mitch!',
    topic: 'mitch',
    author: 'rogersop',
    body:
      'We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages',
    created_at: 1163852514171,
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
    const complexOutput = makeRefObj(complexInput);
    expect(complexOutput).to.deep.equal({
      'Living in the shadow of a great man': 1,
      'Sony Vaio; or, The Laptop': 2,
      'Eight pug gifs that remind me of mitch': 3,
      'Student SUES Mitch!': 4
    })
  })
});

describe('formatComments', () => { });
