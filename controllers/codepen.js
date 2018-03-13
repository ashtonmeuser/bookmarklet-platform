const rp = require('request-promise-native');
const htmlEncode = require('htmlencode').htmlEncode;
const minify = require('uglify-js').minify;
const buble = require('buble');

exports.get = (penData, callback) => {
  let url = 'https://codepen.io/'+penData.author+'/pen/'+penData.id+'.js';

  return rp(url)
    .then(response => {
      let code = parsePenCode(response);
      let pen = {
        author: penData.author,
        id: penData.id,
        title: getPenProperty(response, 'title'),
        about: getPenProperty(response, 'about'),
        code: code,
      };

      return pen;
    });
};

function getPenProperty(penCode, property) {
  let regexpProperty = new RegExp('//[\\s\\t]*bookmarklet_'+property+'[\\s\\t]*[:=][\\s\\t]*(.+)', 'gi');
  let matches = regexpProperty.exec(penCode);

  return (matches !== null) ? htmlEncode(matches[1]) : 'no '+property;
}

function parsePenCode(response) {
  let code = null;
  try {
    code = transpilePenCode(response);
    code = minimizePenCode(code);
  } catch(error) {
    return null;
  }

  return htmlEncode(code);
}

function transpilePenCode(penCode) {
  return buble.transform(penCode).code;
}

function minimizePenCode(penCode) {
  let options = {fromString: true, mangle: false};

  return minify(penCode, options).code;
}
