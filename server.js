var express = require('express');
var codepen = require('./controllers/codepen');
var app = express();
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.set('port', (process.env.PORT || 5000));

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.get('/:author/:id', function(request, response) {
  var penData = {author: request.param('author'), id: request.param('id')};

  codepen.get(penData, function(penData, penCode){
    response.render('pages/bookmarklet', {penData: penData, penCode: penCode});
  });
});

app.listen(app.get('port'), function() {
  console.log('Node app running on port ', app.get('port'));
});
