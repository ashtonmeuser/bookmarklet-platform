import { parseGistUrl } from './parseUrl';

const data = () => ({
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

window.data = data;
export default data;
