import * as esbuild from 'esbuild-wasm';

const ESBUILD_INITIALIZE = esbuild.initialize({ wasmURL: 'https://unpkg.com/esbuild-wasm/esbuild.wasm' }); // Must be resolved before transpilation

type Loader = (args: esbuild.OnLoadArgs) => Promise<esbuild.OnLoadResult | undefined>;

const loader = (loader?: esbuild.Loader): Loader => (async (args) => {
  const response = await globalThis.fetch(args.path);
  if (!response.ok) throw new Error(`Failed to fetch ${args.path}: ${response.statusText}`);
  return { contents: await response.text(), loader };
});

// Simple esbuild plugin to resolve and bundle dependencies
// Static imports are bundled, dynamic imports are not
// Top-level relative static and dynamic imports are resolved relative to custom CDN to deliver gist content
// Dynamic imports require Content-Type: text/javascript which GitHub does not provide
const plugin = (sourcefile: string, cdn: string): esbuild.Plugin => ({
  name: `${sourcefile}-plugin`,
  setup(build) {
    build.onResolve({ filter: /^\.?\//, namespace: '' }, (args) => {
      const url = new URL(args.path, args.importer === sourcefile ? cdn : args.importer).toString();
      if (args.kind === 'import-statement') return { path: url, namespace: 'static' };
      if (args.kind === 'dynamic-import') return { path: url, external: true };
    });

    build.onResolve({ filter: /^https?:\/\// }, (args) => {
      if (args.kind === 'import-statement') return { path: args.path, namespace: 'static' };
      return { path: args.path, external: true };
    });

    build.onLoad({ filter: /\.m?js$/, namespace: 'static' }, loader('js'));
    build.onLoad({ filter: /\.(ts|mts|tsx)$/, namespace: 'static' }, loader('ts'));
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

export const config = (sourcefile: string, cdn: string): esbuild.BuildOptions => ({
  bundle: true, // Bundle dependencies
  target: ['esnext'], // Alternatively, es2017
  minify: true, // Tree shake, minify
  plugins: [plugin(sourcefile, cdn)], // Resolve imports
  write: false, // Prevents tests writing to FS
  stdin: { contents: '', loader: 'ts', sourcefile }, // Load from in-memory buffer instead of FS
});

export const transpile = async (config: esbuild.BuildOptions, code: string): Promise<string> => {
  await ESBUILD_INITIALIZE; // Ensure esbuild is initialized
  const result = await esbuild.build({
    ...config,
    stdin: { ...config.stdin, contents: code },
  });
  return result.outputFiles![0].text;
};
