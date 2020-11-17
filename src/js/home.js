import { parseGistUrl } from './parseUrl';

window.data = () => ({
  gistUrl: '',
  get bookmarkletUrl() {
    try {
      const props = parseGistUrl(this.gistUrl);
      return `/${props.author}/${props.id}/${props.commit || ''}/${props.file || ''}`.replace(/\/+$/, '');
    } catch (error) {
      return null;
    }
  },
  get valid() {
    return this.bookmarkletUrl !== null;
  },
});
