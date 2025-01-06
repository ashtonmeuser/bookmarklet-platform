import { v4 as uuid } from 'uuid';
import BookmarkletError from "./error";
const Babel = require('@babel/standalone');

enum VariableType {
  TEXT = 'text',
  PASSWORD = 'password',
  NUMBER = 'number',
  AUTHOR = 'author',
  ID = 'id',
  UUID = 'uuid',
};

type Variable = { type: VariableType, value: string | number| null };
type VariableMap = { [key: string]: Variable };

async function fetch(url: string): Promise<string> {
  try {
    const response = await globalThis.fetch(url);
    if (!response.ok) throw new BookmarkletError(response.status, 'failed to fetch javascript code');
    return response.text();
  } catch(e) {
    if (e instanceof BookmarkletError) throw e;
    else throw new BookmarkletError(500, 'failed to fetch javascript code');
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
  const matches = code.matchAll(/\/\/[\s\t]*bookmarklet[-_]var(?:\((\w+)\))?[\s\t]*[:=][\s\t]*([a-z_$][\w$]*)[\s\t]*$/gim);
  return Array.from(matches).reduce((acc: VariableMap, match: RegExpExecArray): VariableMap => {
    const key = match[2];
    const type = match[1]?.toLowerCase();
    if (!(key in acc)) {
      acc[key] = {
        type: isVariableType(type) ? type : VariableType.TEXT,
        value: null,
      }
    }
    return acc;
  }, {});
}

function replaceVariables(code: string, variables: VariableMap) {
  const escape = (s) => s.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&');
  for (const [key, variable] of Object.entries(variables)) {
    const r = new RegExp(`^.*//[\\s\\t]*bookmarklet[-_]var(?:\\((\\w+)\\))?[\\s\\t]*[:=][\\s\\t]*${escape(key)}[\\s\\t]*$`, 'im');
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
  _code: string | undefined; // Can't be private due to Alpine's Proxy usage
  href: string | null;
  error: Error | undefined;

  constructor(author: string, id: string, version?: string, file?: string) {
    if (!author || !id) throw new Error('invalid author or id');
    this.author = author;
    this.id = id;
    this.version = version;
    this.file = file;
    this.title = 'bookmarklet';
    this.variables = {};
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

  get code(): string | undefined {
    return this._code;
  }

  set code(code: string) {
    this._code = code;
    this.title = extractProperty(code, 'title') || 'bookmarklet';
    this.about = extractProperty(code, 'about');
    this.syncVariables();
    this.transpile();
  }

  async load(): Promise<void> {
    this.code = await fetch(`https://gist.githubusercontent.com/${this.author}/${this.id}/raw/${this.version || ''}/${this.file || ''}`);
  }

  transpile(): void {
    if (this.code === undefined) return; // Code has not yet been fetched
    this.error = undefined;
    let code = replaceVariables(this.code, this.variables);
    try {
      code = Babel.transform(code, { presets: ['env'], minified: true, comments: false }).code;
      this.href = `javascript:(function(){${encodeURIComponent(`${code}`)}})();`;
    } catch(e) {
      this.href = null;
      this.error = e;
    }
  }

  syncVariables(): void {
    if (this.code === undefined) return;

    const update = extractVariables(this.code);

    for (const key of Object.keys(this.variables)) {
      if (!(key in update)) delete this.variables[key]; // Remove variable
    }

    for (const [key, variable] of Object.entries(update)) {
      if (this.variables[key]?.type === variable.type) continue; // Variable exists

      // Apply some defaults
      if (variable.type === VariableType.AUTHOR) variable.value = this.author;
      else if (variable.type === VariableType.ID) variable.value = this.id;
      else if (variable.type === VariableType.UUID) variable.value = uuid();

      // Insert or overwrite variable proxy
      this.variables[key] = new Proxy(variable, {
        set: (target, key: string, value: string | number) => {
          if (key !== 'value') return false;
          if (target.type === VariableType.NUMBER) target.value = value === '' ? null : Number.isNaN(Number(value)) ? null : Number(value);
          else target.value = String(value);
          this.transpile(); // Kick off transpilation when variables change
          return true;
        },
      });
    }
  }
}
