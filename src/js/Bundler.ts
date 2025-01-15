import * as esbuild from 'esbuild-wasm';

const ESBUILD_INITIALIZE = esbuild.initialize({ wasmURL: 'https://unpkg.com/esbuild-wasm/esbuild.wasm' }); // Must be resolved before transpilation

type Loader = (args: esbuild.OnLoadArgs) => Promise<esbuild.OnLoadResult | undefined>;
type BundlerOptions = { sourcefile?: string, cdn?: string };
export class OutdatedBundleError extends Error {}

const loader = (loader?: esbuild.Loader): Loader => (async (args) => {
  const response = await globalThis.fetch(args.path);
  if (!response.ok) throw new Error(`Failed to fetch ${args.path}: ${response.statusText}`);
  const contents = new Uint8Array(await response.arrayBuffer());
  return { contents, loader };
});

// Simple esbuild plugin to resolve and bundle dependencies
// Static imports are bundled, dynamic imports are not
// Top-level relative static and dynamic imports are resolved relative to custom CDN to deliver gist content
// Dynamic imports require Content-Type: text/javascript which GitHub does not provide
const plugin = (options: BundlerOptions): esbuild.Plugin => ({
  name: 'bundler-plugin',
  setup(build) {
    build.onResolve({ filter: /^\.?\.?\// }, (args) => {
      const url = new URL(args.path, args.importer === options.sourcefile ? options.cdn : args.importer).toString();
      if (args.kind === 'import-statement') return { path: url, namespace: 'static' };
      if (args.kind === 'dynamic-import') return { path: url, external: true };
    });

    build.onResolve({ filter: /^https?:\/\// }, (args) => {
      if (args.kind === 'import-statement') return { path: args.path, namespace: 'static' };
      if (args.kind === 'dynamic-import') return { path: args.path, external: true };
    });

    build.onLoad({ filter: /\.m?js$/, namespace: 'static' }, loader('js'));
    build.onLoad({ filter: /\.(tsx?|mts)$/, namespace: 'static' }, loader('ts'));
    build.onLoad({ filter: /\.jsx$/, namespace: 'static' }, loader('jsx'));
    build.onLoad({ filter: /\.json$/, namespace: 'static' }, loader('json'));
    build.onLoad({ filter: /\.css$/, namespace: 'static' }, loader('css'));
    build.onLoad({ filter: /\.(png|jpe?g|gif)$/, namespace: 'static' }, loader('file'));
    build.onLoad({ filter: /\.svg$/, namespace: 'static' }, loader('dataurl'));
    build.onLoad({ filter: /\.(html|txt|md|xml|yml|dat)$/, namespace: 'static' }, loader('text'));
    build.onLoad({ filter: /\.(bin|wasm)$/, namespace: 'static' }, loader('binary'));
    build.onLoad({ filter: /.*/, namespace: 'static' }, loader());
  },
});

export class Bundler {
  readonly config: esbuild.BuildOptions;
  #latest: Symbol | null = null; // Record latest build token

  constructor(options?: BundlerOptions) {
    this.config = {
      bundle: true, // Bundle dependencies
      target: ['esnext'], // Alternatively, es2017
      minify: true, // Tree shake, minify
      plugins: [plugin({ sourcefile: '<stdin>', ...options })], // Resolve imports
      write: false, // Prevents tests writing to FS
      stdin: { contents: '', loader: 'ts', sourcefile: options?.sourcefile }, // Load from in-memory buffer instead of FS
    };
  }

  async build(code: string, define?: { [key: string]: string }): Promise<string> {
    await ESBUILD_INITIALIZE; // Ensure esbuild is initialized
    this.config.define = define;
    this.config.stdin!.contents = code;
    const token = Symbol();
    this.#latest = token;
    const result = await esbuild.build(this.config);
    if (this.#latest != token) throw new OutdatedBundleError();
    return result.outputFiles![0].text;
  };
}
