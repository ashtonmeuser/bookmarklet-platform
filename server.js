const express = require('express');
const codepen = require('./controllers/codepen');
const app = express();
app.set('view engine', 'ejs');
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.get('/:author/:id', function(request, response) {
  let penData = {author: request.params.author, id: request.params.id};

  codepen.get(penData)
    .then(pen => {
      if(pen.code !== null) {
        response.render('pages/bookmarklet', {pen: pen});
      }else{
        response.render('pages/invalid_code', {pen: pen, error: 'encountered error when processing codepen js'});
      }
    })
    .catch(error => {
      response.render('pages/not_found', {error: 'could not retrieve codepen information'});
    });
});

app.get('*', function(request, response) {
  response.status(404);
  response.render('pages/not_found', {error: 'page not found'});
});

app.listen(app.get('port'), function() {
  console.log('Node app running on port ', app.get('port'));
});
