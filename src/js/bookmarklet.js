import Alpine from 'alpinejs';
import Gist from './Gist';
import { parseBookmarkletUrl } from './parseUrl';

const data = () => ({
  message: 'loading bookmarklet...',
  error: false,
  author: null,
  id: null,
  version: null,
  file: null,
  gistUrl: null,
  about: null,
  title: null,
  href: null,
  size: null,
  async init() {
    try {
      const params = parseBookmarkletUrl(window.location.href);
      const gist = new Gist(params.author, params.id, params.version, params.file);
      this.author = gist.author;
      this.id = gist.id;
      this.version = gist.version;
      this.file = gist.file;
      this.gistUrl = gist.url;
      this.message = 'downloading js...';
      await gist.fetchCode();
      this.about = gist.about;
      this.title = gist.title || 'no title';
      document.title = gist.title || document.title;
      this.message = 'transpiling js...';
      gist.transpileCode();
      this.href = gist.href;
      this.size = gist.size;
    } catch (error) {
      this.error = true;
      this.message = error.message;
    }
  },
});

window.data = data;
export default data;

Alpine.start();
