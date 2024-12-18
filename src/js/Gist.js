import getRequest from './getRequest';

const stringSize = (string) => {
  const suffixes = ['B', 'kB', 'MB', 'GB', 'TB', 'PB'];
  const size = new Blob([string]).size;
  const i = Math.floor(Math.log(size) / Math.log(1024));
  return `${(size / 1024 ** i).toFixed(i > 0 ? 1 : 0)} ${suffixes[i]}`;
};

const Status = Object.freeze({
  LOADING: 'loading',
  DOWNLOADING: 'downloading',
  TRANSPILING: 'transpiling',
  SUCCESS: 'success',
});

export default class Gist {
  constructor(author, id, version, file) {
    if (!author || !id) throw new Error('invalid author or id');
    this.author = author;
    this.id = id;
    this.version = version || null;
    this.file = file || null;
    this.url = `https://gist.github.com/${this.author}/${this.id}/${this.version || ''}`;
    this.variables = {};
    this.status = Status.LOADING;
  }

  extractProperty(property) {
    const r = new RegExp(`^[\\s\\t]*//[\\s\\t]*bookmarklet[-_]${property}[\\s\\t]*[:=][\\s\\t]*(.+)`, 'im');
    const matches = this.code.match(r);
    return matches === null ? null : matches[1];
  }

  extractVariables() {
    const matches = this.code.matchAll(/^[\s\t]*\/\/[\s\t]*bookmarklet[-_]var[\s\t]*[:=][\s\t]*([a-z_$][\w$]*)[\s\t]*$/gim);
    return Array.from(matches).reduce((acc, match) => ({ ...acc, [match[1]]: '' }), {});
  }

  replaceVariables() {
    let code = this.code;
    const escape = (s) => s.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&');
    for (const [key, value] of Object.entries(this.variables)) {
      const r = new RegExp(`^[\\s\\t]*//[\\s\\t]*bookmarklet[-_]var[\\s\\t]*[:=][\\s\\t]*${escape(key)}[\\s\\t]*$`, 'im');
      code = code.replace(r, `const ${key} = ${JSON.stringify(value)};\n`);
    }
    return code;
  }

  async fetch() {
    this.status = Status.DOWNLOADING;
    this.code = await getRequest(`https://gist.githubusercontent.com/${this.author}/${this.id}/raw/${this.version || ''}/${this.file || ''}`);
    this.title = this.extractProperty('title') || 'no title';
    this.about = this.extractProperty('about');
    this.variables = this.extractVariables();
  }

  transpile() {
    if (!this.code) return; // Code has not yet been fetched
    this.status = Status.TRANSPILING;
    let code = this.replaceVariables();
    code = Babel.transform(code, { presets: ['env'], minified: true }).code;
    this.href = `javascript:(function(){${encodeURIComponent(`${code}`)}})();`;
    this.size = stringSize(this.href);
    this.status = Status.SUCCESS;
  }
}
