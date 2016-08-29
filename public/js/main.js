onload = function () {
  var input = document.getElementById('codepen_url');
  if(input != null){
    input.oninput = input_handler;
    input.onpropertychange = input.oninput;
    generate_bookmarklet(input.value);
  }
};

function input_handler(event){
  generate_bookmarklet(event.target.value);
}

function generate_bookmarklet(url){
  var button = document.getElementById('generate_bookmarklet');
  var regexpCodepen = new RegExp('codepen.io\/([a-zA-Z0-9]+)\/pen\/([a-zA-Z0-9]+).*', 'gi');
  var matches = regexpCodepen.exec(url);
  if(matches != null && matches[1] != null && matches[2] != null){
    button.className = 'button primary';
    button.setAttribute('href', `/${matches[1]}/${matches[2]}`);
  }else{
    button.className = 'button primary disabled';
    button.removeAttribute('href');
  }
}
