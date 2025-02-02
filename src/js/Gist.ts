import { v4 as uuid } from 'uuid';
import BookmarkletError from './error';
import { Bundler, OutdatedBundleError } from './Bundler';

enum VariableType {
  TEXT = 'text',
  PASSWORD = 'password',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  AUTHOR = 'author',
  ID = 'id',
  UUID = 'uuid',
};

type Variable = { type: VariableType, value: string | number | boolean | null };
type VariableMap = { [key: string]: Variable };

async function fetch(url: string): Promise<string> {
  try {
    const response = await globalThis.fetch(url);
    if (!response.ok) throw new BookmarkletError(response.status, 'failed to fetch javascript code');
    return response.text();
  } catch(e) {
    throw e instanceof BookmarkletError ? e : new BookmarkletError(500, 'failed to fetch javascript code');
  }
}

function getVariableType(type?: string): VariableType {
  if (!type) return VariableType.TEXT;
  const isVariableType = (value: string): value is VariableType => Object.values(VariableType).includes(value as VariableType);
  const lower = type.toLowerCase();
  return isVariableType(lower) ? lower : VariableType.TEXT
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
    const type = getVariableType(match[1]);
    if (!(key in acc)) {
      acc[key] = { type, value: null };
    }
    return acc;
  }, {});
}

function defineVariables(variables: VariableMap): { [key: string]: string } {
  return Object.fromEntries(Object.entries(variables).map(([key, variable]) => {
    return [key, JSON.stringify(variable.value)];
  }));
}

function replaceVariables(code: string): string {
  return code.replace(/^.*\/\/[\s\t]*bookmarklet[-_]var(?:\((\w+)\))?[\s\t]*[:=][\s\t]*([a-z_$][\w$]*)[\s\t]*$/gim, '');
}

export default class Gist {
  readonly author: string;
  readonly id: string;
  readonly version: string | undefined;
  readonly file: string | undefined;
  readonly path: string;
  readonly url: string;
  readonly banner: string;
  readonly bundler: Bundler;
  title: string = 'bookmarklet';
  about: string | undefined;
  href: string | null = null;
  error: Error | undefined;
  private _variables: VariableMap = {};
  private _code: string | undefined;

  constructor(author: string, id: string, version?: string, file?: string) {
    this.author = author;
    this.id = id;
    this.version = version;
    this.file = file;
    this.path = `${this.author}/${this.id}/raw${this.version ? `/${this.version}` : ''}/${this.file ?? ''}`;
    this.url = `https://gist.github.com/${this.author}/${this.id}${this.version ? `/${this.version}` : ''}`;
    this.banner = `/*https://bookmarkl.ink/${this.author}/${this.id}${this.version ? `/${this.version}` : ''}${this.file ? `/${this.file}` : ''}*/`;
    this.bundler = new Bundler({ sourcefile: 'bookmarklet', cdn: { static: `https://gist.githubusercontent.com/${this.path}`, dynamic: `https://cdn.bookmarkl.ink/${this.path}` } })
  }

  get size(): string {
    if (!this.href) return '0 B';
    const suffixes = ['B', 'kB', 'MB', 'GB', 'TB', 'PB'];
    const size = new Blob([this.href]).size;
    const i = Math.floor(Math.log(size) / Math.log(1024));
    return `${(size / 1024 ** i).toFixed(i > 0 ? 1 : 0)} ${suffixes[i]}`;
  }

  get code(): string | undefined {
    return this._code;
  }

  set code(code: string) {
    if (this._code === code) return; // No action needed
    this._code = code;
    this.title = extractProperty(code, 'title') || 'bookmarklet';
    this.about = extractProperty(code, 'about');
    this._syncVariables();
    this.transpile(); // Kick off transpilation when code changes
  }

  get variables(): VariableMap {
    return Object.fromEntries(Object.entries(this._variables).filter(([_, variable]) => ["text", "number", "password", "boolean"].includes(variable.type)));
  }

  async load(): Promise<void> {
    this.code = await fetch(`https://gist.githubusercontent.com/${this.path}`);
  }

  async transpile(): Promise<void> {
    if (this.code === undefined) return; // Code has not yet been fetched
    this.error = undefined;
    try {
      const result = await this.bundler.build(replaceVariables(this.code), defineVariables(this._variables));
      this.href = `javascript:${this.banner}${encodeURIComponent(result)}`;
    } catch(e) {
      if (e instanceof OutdatedBundleError) return;
      this.href = null;
      this.error = e;
    }
  }

  private _syncVariables(): void {
    if (this.code === undefined) return;

    const update = extractVariables(this.code);

    for (const key of Object.keys(this._variables)) {
      if (!(key in update)) delete this._variables[key]; // Remove variable
    }

    for (const [key, variable] of Object.entries(update)) {
      if (this._variables[key]?.type === variable.type) continue; // Variable exists

      // Apply non-null defaults
      if (variable.type === VariableType.BOOLEAN) variable.value = false;
      else if (variable.type === VariableType.AUTHOR) variable.value = this.author;
      else if (variable.type === VariableType.ID) variable.value = this.id;
      else if (variable.type === VariableType.UUID) variable.value = uuid();

      // Insert or overwrite variable proxy
      this._variables[key] = new Proxy(variable, {
        set: (target, key: string, value: string | number | boolean) => {
          if (key !== 'value') return false;
          if (target.type === VariableType.NUMBER) target.value = value === '' ? null : Number.isNaN(Number(value)) ? null : Number(value);
          else if (target.type === VariableType.BOOLEAN) target.value = Boolean(value);
          else if (target.type == VariableType.TEXT || target.type == VariableType.PASSWORD) target.value = String(value);
          this.transpile(); // Kick off transpilation when variables change
          return true;
        },
      });
    }
  }
}
