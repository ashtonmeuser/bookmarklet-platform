const getPenProperty = (penCode, property) => {
  const propertyRegex = new RegExp(`//[\\s\\t]*bookmarklet_${property}[\\s\\t]*[:=][\\s\\t]*(.+)`, 'i');
  const matches = penCode.match(propertyRegex);

  return matches !== null ? matches[1] : `no ${property}`;
};

const getRequest = url => new Promise((resolve, reject) => {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.onload = () => {
    if (xhr.status === 200) {
      return resolve(xhr.response);
    }
    return reject(new Error(`failed to fetch javascript with code ${xhr.status}`));
  };
  xhr.onerror = () => {
    reject(new Error(`failed to fetch javascript with code ${xhr.status}`));
  };
  xhr.send();
});

const parsePenCode = (response) => {
  try {
    const { code } = Babel.transform(response, { presets: ['es2015'], minified: true });
    return encodeURIComponent(code);
  } catch (error) {
    throw new Error('could not parse codepen javascript');
  }
};

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

class Pen {
  constructor(author, id, raw) {
    this.author = author;
    this.id = id;
    this.title = getPenProperty(raw, 'title');
    this.about = getPenProperty(raw, 'about');
    this.code = parsePenCode(raw);
  }
}

window.onhashchange = () => { window.location.reload(); };

window.onload = async () => {
  try {
    const { author, id } = parseHash();
    revealCodepenLink(author, id);
    document.getElementById('span-modal-message').innerText = 'downloading pen...';
    const response = await getRequest(`https://codepen.io/${author}/pen/${id}.js`);
    document.getElementById('span-modal-message').innerText = 'transpiling js...';
    const pen = new Pen(author, id, response);
    populatePenProperties(pen);
    const button = document.getElementById('anchor-bookmarklet');
    button.setAttribute('href', `javascript:${pen.code}`);
    button.classList.remove('disabled');
    document.getElementById('div-bookmarklet-title').innerText = pen.title;
    const modal = document.getElementById('div-modal');
    modal.style.opacity = 0;
    modal.style.visibility = 'hidden';
  } catch (error) {
    const message = document.getElementById('span-modal-message');
    message.innerText = error.message;
    message.classList.add('error');
  }
};
