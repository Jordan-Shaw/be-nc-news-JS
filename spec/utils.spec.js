const { expect } = require('chai');
const {
  formatDates,
  makeRefObj,
  formatComments,
} = require('../db/utils/utils');

let articleData = require('../db/data/test-data/articles.js');
let individualArticle = [articleData[0]]


describe('formatDates', () => {
  it('Should return an array', () => {
    const output = formatDates(individualArticle);
    expect(output).to.be.an('Array');
  });
  it('Should return an entirely new array and the original array should not be mutated', () => {
    const output = formatDates(individualArticle);
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
    const output = formatDates(individualArticle);
    expect(output[0]).to.be.an('Object');
  })
  it('Returned objeects should be new i.e. should have a new reference', () => {
    const output = formatDates(individualArticle);
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
    const output = formatDates(individualArticle);
    expect(output[0]).to.have.keys('title', 'topic', 'author', 'body', 'created_at', 'votes');
  })
  it('The value of the created_at property of returned objects in the array should date objects', () => {
    const output = formatDates(individualArticle);
    expect(output[0]['created_at'] instanceof Date).to.equal(true);
  });
  it("created_at property of returned objects should be in the format:`$(Weekday), $(Date) $(Time)`", () => {
    const output = formatDates(individualArticle);
    expect(output[0]['created_at']).to.deep.equal(new Date(1542284514171));
  })
  it('Should function correctly with more than one object\'s created_at property to convert', () => {
    const output = formatDates(articleData);
    expect(output[0].title).to.equal('Living in the shadow of a great man');
    expect(output[0]['created_at']).to.deep.equal(new Date(1542284514171));
    expect(output[1].title).to.equal('Sony Vaio; or, The Laptop');
    expect(output[1]['created_at']).to.deep.equal(new Date(1416140514171))
  })
})

describe('makeRefObj', () => { });

describe('formatComments', () => { });
