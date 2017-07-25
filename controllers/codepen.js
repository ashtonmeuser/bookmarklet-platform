var https = require('https');
var htmlEncode = require('htmlencode').htmlEncode;
var minify = require('uglify-js').minify;
var buble = require('buble');

exports.get = function(penData, callback){
  var url = 'https://codepen.io/'+penData.author+'/pen/'+penData.id+'.js';

  https.request(url, function(response){
    var penCode = '';

    if(response.statusCode !== 200) {
      response.destroy();
    }

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
        penData.title = getPenProperty(penCode, 'title');
        penData.about = getPenProperty(penCode, 'about');
        penCode = transpilePenCode(penCode);
        penCode = minimizePenCode(penCode);
        callback(penData, penCode ? htmlEncode(penCode) : null);
      }
    });
  }).end();
};

function getPenProperty(penCode, property) {
  var regexpProperty = new RegExp('//[\\s\\t]*bookmarklet_'+property+'[\\s\\t]*[:=][\\s\\t]*(.+)', 'gi');
  var matches = regexpProperty.exec(penCode);
  return (matches !== null) ? htmlEncode(matches[1]) : 'no '+property;
}

function transpilePenCode(penCode) {
  var penCodeTranspiled = null;
  try{
    penCodeTranspiled = buble.transform(penCode).code;
  }catch(error){ }
  return penCodeTranspiled;
}

function minimizePenCode(penCode) {
  var options = {fromString: true, mangle: false};
  var penCodeMinified = null;
  try{
    penCodeMinified = minify(penCode, options).code;
  }catch(error){ }
  return penCodeMinified;
}
