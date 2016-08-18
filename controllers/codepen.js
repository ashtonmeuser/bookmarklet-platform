var http = require('http');
var htmlEncode = require('htmlencode').htmlEncode;
var minify = require('uglify-js').minify;

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
        callback(penData, minimizePenCode(penCode));
      }
    });
  }).end();
};

function getPenProperty(penCode, property) {
  var regexpProperty = new RegExp(`//[\\s\\t]*bookmarklet_${property}[\\s\\t]*=[\\s\\t]*(.+)`, 'gi');
  var matches = regexpProperty.exec(penCode);
  return (matches !== null) ? htmlEncode(matches[1]) : null;
}

function minimizePenCode(penCode) {
  var options = {fromString: true, mangle: false};
  return htmlEncode(minify(penCode, options).code);
}
