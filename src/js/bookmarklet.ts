import Alpine from 'alpinejs';
import Gist from './Gist';
import { parseBookmarkletUrl } from './parseUrl';

type Data = {
  gist: Gist | null;
  error: Error | null;
  init: () => void;
}

const data = (): Data => ({
  gist: null,
  error: null,
  async init() {
    try {
      const params = parseBookmarkletUrl(globalThis.location.href);
      this.gist = new Gist(params.author, params.id, params.version, params.file);
      await this.gist.load();
      document.title = `bookmarkl.ink · ${this.gist.title}`;
      this.gist.transpile();
    } catch (e) {
      console.error(e);
      this.error = e;
    }
  },
});

globalThis.data = data;
export default data;

Alpine.start();
