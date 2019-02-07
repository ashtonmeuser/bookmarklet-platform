import Pen from './Pen';
import getRequest from './getRequest';

const revealCodepenLink = (author, id) => {
  const row = document.getElementById('row-codepen-link');
  const link = document.createElement('a');
  link.innerText = 'view on codepen';
  link.target = '_blank';
  link.href = `http://codepen.io/${author}/pen/${id}?editors=0010`;
  link.className = 'link';
  row.appendChild(link);
  row.style.display = 'flex';
};

const parseHash = () => {
  const hashRegex = new RegExp('([-_a-z0-9]+)/([a-z0-9]+).*', 'i');
  const matches = window.location.hash.match(hashRegex);
  if (matches !== null && matches[1] !== null && matches[2] !== null) {
    return { author: matches[1], id: matches[2] };
  }
  throw new Error('invalid codepen author or id');
};

const populatePenProperties = (pen) => {
  try {
    ['author', 'id', 'title', 'about'].forEach((property) => {
      document.getElementById(`div-property-${property}`).innerText = pen[property];
    });
  } catch (error) {
    throw new Error('failed to list bookmarklet properties');
  }
};

const revealBookmarkletHidden = () => {
  Array.from(document.getElementsByClassName('bookmarklet-hidden')).forEach((element) => {
    element.classList.remove('bookmarklet-hidden');
  });
};

const copyToClipboard = (string) => {
  const textArea = document.createElement('textarea');
  textArea.value = string;
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand('copy');
  document.body.removeChild(textArea);
};

const displayModal = (message = null, error = false) => {
  const modal = document.getElementById('div-modal');
  if (message === null) {
    modal.classList.remove('modal-hidden');
    modal.style.opacity = 0;
    modal.style.visibility = 'hidden';
  } else {
    modal.classList.add('modal-hidden');
    document.getElementById('span-modal-message').innerText = message;
    if (error) modal.classList.add('error');
    else modal.classList.remove('error');
    modal.style.opacity = 1;
    modal.style.visibility = 'visible';
  }
};

const handleContextMenu = (event) => {
  const button = document.getElementById('anchor-bookmarklet');
  copyToClipboard(button.href);
  displayModal('copied to clipboard');
  window.setTimeout(displayModal, 1500);
  event.preventDefault();
  event.stopPropagation();
  return false;
};

const displayBookmarkletButton = (pen) => {
  const button = document.getElementById('anchor-bookmarklet');
  button.oncontextmenu = handleContextMenu;
  button.setAttribute('href', `javascript:${pen.code}`);
  button.classList.remove('disabled');
  document.getElementById('div-bookmarklet-title').innerText = pen.title;
};

window.onhashchange = () => { window.location.reload(); };

window.onload = async () => {
  try {
    const { author, id } = parseHash();
    try {
      displayModal('downloading pen...');
      const response = await getRequest(`https://codepen.io/${author}/pen/${id}.js`);
      displayModal('transpiling js...');
      const pen = new Pen(author, id, response);
      populatePenProperties(pen);
      displayBookmarkletButton(pen);
      displayModal();
      revealBookmarkletHidden();
    } finally {
      revealCodepenLink(author, id);
    }
  } catch (error) {
    displayModal(error.message, true);
  }
};
