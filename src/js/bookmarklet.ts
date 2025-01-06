import Alpine from 'alpinejs';
import Gist from './Gist';
import { parseBookmarkletUrl } from './parseUrl';
import BookmarkletError from './error';
import insertEditor from './editor';

type Data = {
  gist: Gist | null;
  error: BookmarkletError | null;
  edit: boolean,
  copy: () => void;
  init: () => void;
}

const data = (): Data => ({
  gist: null,
  error: null,
  edit: globalThis.location.hash === '#edit',
  async copy() {
    if (this.gist?.href) return navigator.clipboard.writeText(this.gist.href);
  },
  async init() {
    try {
      const params = parseBookmarkletUrl(globalThis.location.href);
      this.gist = new Gist(params.author, params.id, params.version, params.file);
      await this.gist.load();
      document.title = `bookmarkl.ink · ${this.gist.title}`;
      insertEditor(this.$refs.editor, this.gist.code, (code: string) => { this.gist.code = code; });
    } catch (e) {
      if (e instanceof BookmarkletError) this.error = e;
      else this.error = new BookmarkletError(500, 'unexpected error');
    }
  },
});

globalThis.data = data;
export default data;

Alpine.start();
