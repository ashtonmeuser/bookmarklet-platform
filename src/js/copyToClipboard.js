const selectTextArea = (element) => {
  const isReadOnly = element.hasAttribute('readonly');
  if (!isReadOnly) element.setAttribute('readonly', '');
  element.select();
  element.setSelectionRange(0, element.value.length);
  if (!isReadOnly) element.removeAttribute('readonly');
  return element.value;
};

const copyToClipboard = (string) => {
  const fakeElem = document.createElement('textarea');
  // Prevent zooming on iOS
  fakeElem.style.fontSize = '12pt';
  // Reset box model
  fakeElem.style.border = '0';
  fakeElem.style.padding = '0';
  fakeElem.style.margin = '0';
  // Move element out of screen horizontally
  fakeElem.style.position = 'absolute';
  fakeElem.style.left = '-9999px';
  // Move element to the same position vertically
  const yPosition = window.pageYOffset || document.documentElement.scrollTop;
  fakeElem.style.top = `${yPosition}px`;
  fakeElem.setAttribute('readonly', '');
  fakeElem.value = string;
  document.body.appendChild(fakeElem);
  selectTextArea(fakeElem);
  try {
    if (!document.execCommand('copy')) {
      throw new Error();
    }
  } catch (err) {
    throw new Error('failed to copy to clipboard');
  } finally {
    document.body.removeChild(fakeElem);
  }
};

module.exports = copyToClipboard;
