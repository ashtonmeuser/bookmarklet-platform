import Alpine from 'alpinejs';
import { parseGistUrl } from './parseUrl';

type Data = {
  gistUrl: string;
  bookmarkletUrl: string | null;
  valid: boolean,
  init: () => void;
}

const data = (): Data => ({
  init() {},
  gistUrl: '',
  get bookmarkletUrl() {
    try {
      const props = parseGistUrl(this.gistUrl);
      return `/${props.author}/${props.id}/${props.version || ''}/${props.file || ''}`.replace(/\/+$/, '');
    } catch (error) {
      return null;
    }
  },
  get valid() {
    return this.bookmarkletUrl !== null;
  },
});

globalThis.data = data;
export default data;

Alpine.start();
