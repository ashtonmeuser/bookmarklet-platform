const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const nock = require('nock');
const htmlEncode = require('htmlencode').htmlEncode;
const codepen = require('../controllers/codepen');
chai.should();
chai.use(chaiAsPromised);

describe('codepen', function() {
  it('should return pen info if pen is valid', function() {
    let codeRaw = '\
      //bookmarklet_title: test_good_title\n\
      //bookmarklet_about: test_good_about\n\
      alert("test");\n\
    ';
    let penData = {author: 'test_good_author', id: 'test_good_id'};
    let expectedPen = {
      title: 'test_good_title',
      author: 'test_good_author',
      id: 'test_good_id',
      about: 'test_good_about',
      code: htmlEncode('alert("test");')
    };

    nock('https://codepen.io')
      .get('/'+penData.author+'/pen/'+penData.id+'.js').reply(200, codeRaw);

    return codepen.get(penData).should.eventually.eql(expectedPen);
  });

  it('should reject if pen is invalid', function() {
    let penData = {author: 'test_bad_author', id: 'test_bad_id'};

    nock('https://codepen.io')
    	.get('/'+penData.author+'/pen/'+penData.id+'.js').reply(404, "");

    return codepen.get(penData).should.eventually.be.rejected;
  });

  it('should return info with null code if pen code is invalid', function() {
    let penData = {author: 'test_good_author', id: 'test_good_id'};
    let codeRaw = '\
      //bookmarklet_title: test_good_title\n\
      //bookmarklet_about: test_good_about\n\
      *&^%alert("test");*%&&^%&^;\n\
    ';
    let expectedPen = {
      title: 'test_good_title',
      author: 'test_good_author',
      id: 'test_good_id',
      about: 'test_good_about',
      code: null
    };

    nock('https://codepen.io')
    	.get('/'+penData.author+'/pen/'+penData.id+'.js').reply(200, codeRaw);

    return codepen.get(penData).should.eventually.eql(expectedPen);
  });

  it('should get and return pen info if pen contains valid ES6 code', function() {
    let codeRaw = '\
      //bookmarklet_title: test_es6_title\n\
      //bookmarklet_about: test_es6_about\n\
      var name = ["TT","EE","SS","TT"].map(s=>s[0]).join("");\n\
      alert(`HELLO, ${name}`);\n\
    ';
    let penData = {author: 'test_es6_author', id: 'test_es6_id'};
    let expectedPen = {
      title: 'test_es6_title',
      author: 'test_es6_author',
      id: 'test_es6_id',
      about: 'test_es6_about',
      code: htmlEncode('var name=["TT","EE","SS","TT"].map(function(s){return s[0]}).join("");alert("HELLO, "+name);')
    };

    nock('https://codepen.io')
      .get('/'+penData.author+'/pen/'+penData.id+'.js').reply(200, codeRaw);

    codepen.get(penData).should.eventually.eql(expectedPen);
  });
});
