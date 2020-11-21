import getRequest from './getRequest';

const formatBytes = (bytes) => {
  const sizes = ['B', 'kB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / 1024 ** i).toFixed(i > 0 ? 3 : 0)} ${sizes[i]}`;
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
    const propertyRegex = new RegExp(`//[\\s\\t]*bookmarklet[-_]${property}[\\s\\t]*[:=][\\s\\t]*(.+)`, 'i');
    const matches = this.code.match(propertyRegex);
    return matches === null ? null : matches[1];
  }

  async fetchCode() {
    this.code = await getRequest(`https://gist.githubusercontent.com/${this.author}/${this.id}/raw/${this.version || ''}/${this.file || ''}`);
    this.title = this.extractProperty('title');
    this.about = this.extractProperty('about');
  }

  async transpileCode() {
    this.code = Babel.transform(this.code, { presets: ['env'], minified: true }).code;
    this.href = `javascript:(()=>{${encodeURIComponent(`${this.code}`)}})();`;
    this.size = formatBytes(this.href.length);
  }
}
