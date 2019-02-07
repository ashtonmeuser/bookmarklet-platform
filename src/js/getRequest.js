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

module.exports = getRequest;
