const Babel = require('@babel/standalone');

enum Status {
  LOADING = 'loading',
  DOWNLOADING = 'downloading',
  TRANSPILING = 'transpiling',
  SUCCESS = 'success',
};

enum VariableType {
  TEXT = 'text',
  PASSWORD = 'password',
  NUMBER = 'number',
};

type Variable = { type: VariableType, value: string | number| null };
type VariableMap = { [key: string]: Variable };

async function fetch(url: string): Promise<string> {
  try {
    const response = await globalThis.fetch(url);
    if (!response.ok) throw response;
    return response.text();
  } catch {
    throw new Error('failed to fetch javascript code');
  }
}

function isVariableType(value: string): value is VariableType {
  return Object.values(VariableType).includes(value as VariableType);
}

function extractProperty(code: string, property: string): string | undefined {
  const r = new RegExp(`^[\\s\\t]*//[\\s\\t]*bookmarklet[-_]${property}[\\s\\t]*[:=][\\s\\t]*(.+)`, 'im');
  const matches = code.match(r);
  return matches?.[1];
}

function extractVariables(code: string): VariableMap {
  const matches = code.matchAll(/^[\s\t]*\/\/[\s\t]*bookmarklet[-_]var(?:\((\w+)\))?[\s\t]*[:=][\s\t]*([a-z_$][\w$]*)[\s\t]*$/gim);
  return Array.from(matches).reduce((acc: VariableMap, match: RegExpExecArray): VariableMap => ({
    ...acc,
    [match[2]]: {
      type: isVariableType(match[1]) ? match[1] : VariableType.TEXT,
      value: null,
    },
  }), {});
}

function replaceVariables(code: string, variables: VariableMap) {
  const escape = (s) => s.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&');
  for (const [key, variable] of Object.entries(variables)) {
    const r = new RegExp(`^[\\s\\t]*//[\\s\\t]*bookmarklet[-_]var(?:\\((\\w+)\\))?[\\s\\t]*[:=][\\s\\t]*${escape(key)}[\\s\\t]*$`, 'im');
    code = code.replace(r, `const ${key} = ${JSON.stringify(variable.value)};\n`);
  }
  return code;
}

export default class Gist {
  author: string;
  id: string;
  title: string;
  about: string | undefined;
  version: string | undefined;
  file: string | undefined;
  variables: VariableMap;
  status: Status;
  code: string | undefined;
  href: string | undefined;

  constructor(author: string, id: string, version?: string, file?: string) {
    if (!author || !id) throw new Error('invalid author or id');
    this.author = author;
    this.id = id;
    this.version = version;
    this.file = file;
    this.variables = {};
    this.status = Status.LOADING;
  }

  get size(): string {
    if (!this.href) return '0 B';
    const suffixes = ['B', 'kB', 'MB', 'GB', 'TB', 'PB'];
    const size = new Blob([this.href]).size;
    const i = Math.floor(Math.log(size) / Math.log(1024));
    return `${(size / 1024 ** i).toFixed(i > 0 ? 1 : 0)} ${suffixes[i]}`;
  }

  get url(): string {
    return `https://gist.github.com/${this.author}/${this.id}/${this.version || ''}`;
  }

  async load(): Promise<void> {
    this.status = Status.DOWNLOADING;
    this.code = await fetch(`https://gist.githubusercontent.com/${this.author}/${this.id}/raw/${this.version || ''}/${this.file || ''}`);
    this.title = extractProperty(this.code, 'title') || 'no title';
    this.about = extractProperty(this.code, 'about');
    this.variables = Object.fromEntries(Object.entries(extractVariables(this.code)).map(([key, variable]) => [
      key,
      new Proxy(variable, {
        set: (target, key: string, value: string | number) => {
          if (key !== 'value') return false;
          if (target.type === VariableType.NUMBER) target.value = value === '' ? null : Number.isNaN(Number(value)) ? null : Number(value);
          else target.value = String(value);
          this.transpile(); // Kick off transpilation when variables change
          return true;
        },
      }),
    ]));
  }

  transpile(): void {
    if (!this.code) return; // Code has not yet been fetched
    this.status = Status.TRANSPILING;
    let code = replaceVariables(this.code, this.variables);
    try {
      code = Babel.transform(code, { presets: ['env'], minified: true }).code;
      this.href = `javascript:(function(){${encodeURIComponent(`${code}`)}})();`;
      this.status = Status.SUCCESS;
    } catch(e) {
      console.error(e);
      throw new Error('failed to transpile javascript code');
    }
  }
}
