import Gist from './Gist';

export default class Playground extends Gist {
  readonly author: string;
  readonly id: string;
  readonly url: string;
  readonly banner: string;

  constructor() {
    super('_', '_');
    this.author = '';
    this.id = '';
    this.title = 'playground';
    this.url = '';
    this.banner = '/*https://bookmarkl.ink*/';
  }

  async load(): Promise<void> {
    this.code = `// bookmarklet-title: playground
// bookmarklet-about: Build your own bookmarklet. Once you're happy, save the code to a GitHub gist (http://gist.github.com).

// You can include variables to be bundled into your bookmarklet (see https://github.com/ashtonmeuser/bookmarklet-platform#including-variables).
// bookmarklet-var: name

// You can even bundle external libraries!
// import * as cheerio from 'https://esm.sh/cheerio';
// console.log(cheerio.load('<ul id="fruits">...</ul>').html());

const message = \`Hello, \${name ?? 'World'}!\`;
console.log(message);
alert(message);`;
  }
}
