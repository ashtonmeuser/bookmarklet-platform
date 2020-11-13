const codepenRegex = new RegExp('codepen.io/([-_a-z0-9]+)/pen/([-_a-z0-9]+).*', 'i');

window.data = () => ({
  gistUrl: '',
  get bookmarkletUrl() {
    const matches = this.gistUrl.match(codepenRegex);
    if (matches && matches[1] && matches[2]) {
      return `/${matches[1]}/${matches[2]}`;
    }
    return null;
  },
  get valid() {
    return this.bookmarkletUrl !== null;
  },
});
