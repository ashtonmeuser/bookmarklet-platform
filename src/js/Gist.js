import getRequest from './getRequest';

const stringSize = (string) => {
  const suffixes = ['B', 'kB', 'MB', 'GB', 'TB', 'PB'];
  const size = new Blob([string]).size;
  const i = Math.floor(Math.log(size) / Math.log(1024));
  return `${(size / 1024 ** i).toFixed(i > 0 ? 1 : 0)} ${suffixes[i]}`;
};

export default class Gist {
  constructor(author, id, version, file) {
    if (!author || !id) throw new Error('invalid author or id');
    this.author = author;
    this.id = id;
    this.version = version || null;
    this.file = file || null;
    this.url = `https://gist.github.com/${this.author}/${this.id}/${this.version || ''}`;
  }

  extractProperty(property) {
    const propertyRegex = new RegExp(`^[\\s\\t]*//[\\s\\t]*bookmarklet[-_]${property}[\\s\\t]*[:=][\\s\\t]*(.+)`, 'im');
    const matches = this.code.match(propertyRegex);
    return matches === null ? null : matches[1];
  }

  async fetchCode() {
    this.code = await getRequest(`https://gist.githubusercontent.com/${this.author}/${this.id}/raw/${this.version || ''}/${this.file || ''}`);
    this.title = this.extractProperty('title');
    this.about = this.extractProperty('about');
  }

  transpileCode() {
    this.code = Babel.transform(this.code, { presets: ['env'], minified: true }).code;
    this.href = `javascript:(function(){${encodeURIComponent(`${this.code}`)}})();`;
    this.size = stringSize(this.href);
  }
}
