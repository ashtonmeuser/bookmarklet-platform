import Alpine from 'alpinejs';
import { parseGistPath } from './parsePath';

type Data = {
  gistUrl: string;
  bookmarkletUrl: string | null;
  valid: boolean;
  init: () => void;
}

const data = (): Data => ({
  init() {},
  gistUrl: '',
  get bookmarkletUrl() {
    try {
      const props = parseGistPath(this.gistUrl);
      return `/${props.author}/${props.id}${props.version ? `/${props.version}` : ''}${props.file ? `/${props.file}` : ''}`;
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
