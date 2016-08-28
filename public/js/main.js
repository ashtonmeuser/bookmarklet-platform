onload = function () {
   var input = document.getElementById('codepen_url');
   input.oninput = generate_bookmarklet;
   input.onpropertychange = input.oninput;
};

function generate_bookmarklet(event){
  console.log(event.target.value);
}
