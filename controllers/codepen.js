var http = require('http');
var htmlEncode = require('htmlencode').htmlEncode;
var minify = require('uglify-js').minify;
var babel = require("babel-core");

exports.get = function(penData, callback){
  var url = `http://codepen.io/${penData.author}/pen/${penData.id}.js`;

  http.request(url, function(response){
    var penCode = '';

    if(response.statusCode !== 200) {
      console.log(`Code ${response.statusCode} recieved. Destroying http request.`);
      response.destroy();
    };

    response.on('timeout', function () {
      response.destroy();
    });

    response.on('data', function(chunk) {
      penCode += String(chunk);
    });

    response.on('end', function() {
      if(response.statusCode !== 200) {
        callback(null, null);
      }else{
        penData['title'] = getPenProperty(penCode, 'title');
        penData['about'] = getPenProperty(penCode, 'about');
        penCode = minimizePenCode(transpilePenCode(penCode));
        callback(penData, penCode ? htmlEncode(penCode) : null);
      }
    });
  }).end();
};

function getPenProperty(penCode, property) {
  var regexpProperty = new RegExp(`//[\\s\\t]*bookmarklet_${property}[\\s\\t]*[:=][\\s\\t]*(.+)`, 'gi');
  var matches = regexpProperty.exec(penCode);
  return (matches !== null) ? htmlEncode(matches[1]) : `no ${property}`;
}

function transpilePenCode(penCode) {
  var options = {presets: ["es2015-without-strict"]};
  try{
    var penCodeTranspiled = babel.transform(penCode, options).code;
  }catch(error){
    var penCodeTranspiled = null;
  }
  return penCodeTranspiled;
}

function minimizePenCode(penCode) {
  var options = {fromString: true, mangle: false};
  try{
    var penCodeMinified = minify(penCode, options).code;
  }catch(error){
    var penCodeMinified = null;
  }
  return penCodeMinified;
}
