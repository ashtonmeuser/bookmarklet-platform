var expect = require('chai').expect;
var http = require('http');
var nock = require('nock');
var htmlEncode = require('htmlencode').htmlEncode;
var codepen = require('../controllers/codepen');

describe('codepen', function() {
  it('should return pen info if pen is valid', function(done) {
    var penRaw = '\
      //bookmarklet_title: test_good_title\n\
      //bookmarklet_about: test_good_about\n\
      alert("test");\n\
    ';
    var penData = {author: 'test_good_author', id: 'test_good_id'};
    var expectedData = {
      title: 'test_good_title',
      author: 'test_good_author',
      id: 'test_good_id',
      about: 'test_good_about'
    };
    var expectedCode = htmlEncode('alert("test");');
    nock('http://codepen.io')
      .get('/'+penData.author+'/pen/'+penData.id+'.js').reply(200, penRaw);
    codepen.get(penData, function(penData, penCode){
      expect(penData).to.eql(expectedData);
      expect(penCode).to.eql(expectedCode);
      done();
    });
  });

  it('should return null if pen is invalid', function(done) {
    var penData = {author: 'test_bad_author', id: 'test_bad_id'};
    nock('http://codepen.io')
    	.get('/'+penData.author+'/pen/'+penData.id+'.js').reply(404, "");
    codepen.get(penData, function(penData, penCode){
      expect(penData).to.equal(null);
      expect(penCode).to.equal(null);
      done();
    });
  });

  it('should get and return pen info if pen contains valid ES6 code', function(done) {
    var penRaw = '\
      //bookmarklet_title: test_es6_title\n\
      //bookmarklet_about: test_es6_about\n\
      var name = ["TT","EE","SS","TT"].map(s=>s[0]).join("");\n\
      alert(`HELLO, ${name}`);\n\
    ';
    var penData = {author: 'test_es6_author', id: 'test_es6_id'};
    var expectedData = {
      title: 'test_es6_title',
      author: 'test_es6_author',
      id: 'test_es6_id',
      about: 'test_es6_about'
    };
    var expectedCode = htmlEncode('var name=["TT","EE","SS","TT"].map(function(s){return s[0]}).join("");alert("HELLO, "+name);');
    nock('http://codepen.io')
      .get('/'+penData.author+'/pen/'+penData.id+'.js').reply(200, penRaw);
    codepen.get(penData, function(penData, penCode){
      expect(penData).to.eql(expectedData);
      expect(penCode).to.eql(expectedCode);
      done();
    });
  });
});
