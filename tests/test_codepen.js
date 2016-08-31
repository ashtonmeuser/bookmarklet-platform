var expect = require('chai').expect;
var http = require('http');
var nock = require('nock');
var htmlEncode = require('htmlencode').htmlEncode;
var codepen = require('../controllers/codepen');

describe('codepen', function() {
  var expectedDataGood = {
    title: 'test_good_title',
    author: 'test_good_author',
    id: 'test_good_id',
    about: 'test_good_about'
  };
  var expectedCodeGood = htmlEncode('alert("test");');
  var penRawGood = '\
    //bookmarklet_title: test_good_title\n\
    //bookmarklet_about: test_good_about\n\
    alert("test");\n\
  ';
  var penDataGood = {author: 'test_good_author', id: 'test_good_id'};
  var penDataBad = {author: 'test_bad_author', id: 'test_bad_id'};

  // Mock requests
  nock('http://codepen.io')
  	.get(`/${penDataGood.author}/pen/${penDataGood.id}.js`).reply(200, penRawGood);
  nock('http://codepen.io')
  	.get(`/${penDataBad.author}/pen/${penDataBad.id}.js`).reply(404, "");

  it('codepen.get() should return pen info if pen is valid', function(done) {
    codepen.get(penDataGood, function(penData, penCode){
      expect(penData).to.eql(expectedDataGood);
      expect(penCode).to.eql(expectedCodeGood);
      done();
    });
  });

  it('codepen.get() should return null if pen is invalid', function(done) {
    codepen.get(penDataBad, function(penData, penCode){
      expect(penData).to.equal(null);
      expect(penCode).to.equal(null);
      done();
    });
  });
});
