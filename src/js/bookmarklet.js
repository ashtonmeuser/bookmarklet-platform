import Pen from './Pen';
import getRequest from './getRequest';
import { parseBookmarkletUrl } from './parseUrl';

window.data = () => ({
  message: 'loading bookmarklet...',
  error: false,
  author: null,
  id: null,
  commit: null,
  gistUrl: null,
  about: null,
  title: null,
  code: null,
  get valid() {
    return this.author && this.id;
  },
  async init() {
    try {
      const props = parseBookmarkletUrl(window.location.href);
      this.author = props.author;
      this.id = props.id;
      this.commit = props.commit;
      this.gistUrl = `https://gist.github.com/${this.author}/${this.id}`;
      this.message = 'downloading js...';
      const response = await getRequest(`https://gist.githubusercontent.com/${this.author}/${this.id}/raw`);
      this.message = 'transpiling js...';
      const pen = new Pen(this.author, this.id, response);
      this.about = pen.about;
      this.title = pen.title;
      document.title = pen.title;
      this.code = `javascript:(()=>{${pen.code}})();`;
    } catch (error) {
      this.error = true;
      this.message = error.message;
    }
  },
});
