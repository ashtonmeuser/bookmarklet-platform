const parseBookmarklet = (url) => {
  const button = document.getElementById('anchor-generate-bookmarklet');
  const codepenRegex = new RegExp('codepen.io/([-_a-z0-9]+)/pen/([a-z0-9]+).*', 'i');
  const matches = url.match(codepenRegex);
  if (matches !== null && matches[1] !== null && matches[2] !== null) {
    button.classList.remove('disabled');
    button.setAttribute('href', `/b/#${matches[1]}/${matches[2]}`);
  } else {
    button.classList.add('disabled');
    button.removeAttribute('href');
  }
};

const inputHandler = (event) => {
  parseBookmarklet(event.target.value);
};

window.onload = () => {
  const input = document.getElementById('input-codepen-url');
  try {
    input.oninput = inputHandler;
    input.onpropertychange = input.oninput;
    parseBookmarklet(input.value);
  } catch (error) {
    // Just ignore, I guess
  }
};
