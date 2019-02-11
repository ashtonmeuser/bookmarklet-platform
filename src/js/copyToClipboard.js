const selectTextArea = (element) => {
  element.select();
  element.setSelectionRange(0, element.value.length);
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
  fakeElem.readOnly = true;
  fakeElem.value = string;
  document.body.appendChild(fakeElem);
  selectTextArea(fakeElem);
  try {
    if (!document.execCommand('copy')) {
      throw new Error();
    }
  } catch (error) {
    throw new Error('failed to copy to clipboard');
  } finally {
    document.body.removeChild(fakeElem);
  }
};

module.exports = copyToClipboard;
