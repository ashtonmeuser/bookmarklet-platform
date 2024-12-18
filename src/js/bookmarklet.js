import Alpine from 'alpinejs';
import Gist from './Gist';
import { parseBookmarkletUrl } from './parseUrl';

const data = () => ({
  error: null,
  gist: null,
  async init() {
    try {
      const params = parseBookmarkletUrl(window.location.href);
      this.gist = new Gist(params.author, params.id, params.version, params.file);
      $watch('gist.variables', () => {
        try {
          this.gist.transpile();
        } catch(e) {
          this.error = new Error('failed to transpile javascript code');
        }
      });
      await this.gist.fetch();
      document.title = `bookmarkl.ink · ${this.gist.title}`;
    } catch (error) {
      this.error = error;
    }
  },
});

window.data = data;
export default data;

Alpine.start();
