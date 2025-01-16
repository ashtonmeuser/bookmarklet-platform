import { it, expect } from 'vitest';
import { mockResponse } from './__mock__/fetch';
import './__mock__/TextEncoder';
import './__mock__/esbuild';
import { Bundler, OutdatedBundleError } from '../src/js/Bundler';

it('should create bundler', () => {
  const bundler = new Bundler();
  expect(bundler).toBeInstanceOf(Bundler);
});

it('should bundle code', async () => {
  const bundler = new Bundler();
  const code = 'const someVarName = "test";\nconsole.log(someVarName);';
  const result = await bundler.build(code);
  expect(result).toBe('(()=>{var o="test";console.log(o);})();\n');
});

it('should resolve remote static import', async () => {
  const bundler = new Bundler();
  mockResponse.body = 'console.log("hello")';
  const code = 'import "https://cdn.co/test.js";';
  const result = await bundler.build(code);
  expect(result).toBe('(()=>{console.log("hello");})();\n');
});

it('should resolve relative static import', async () => {
  const bundler = new Bundler({ cdn: 'https://cdn.co' });
  mockResponse.body = 'console.log("hello")';
  const code = 'import "./test.js";';
  const result = await bundler.build(code);
  expect(result).toBe('(()=>{console.log("hello");})();\n');
});

it('should resolve nested static import', async () => {
  const bundler = new Bundler();
  mockResponse.body = 'import "./test.js";';
  const code = 'import "https://cdn.co/test.js";';
  const result = await bundler.build(code);
  expect(result).toBe('(()=>{})();\n');
});

it('should resolve remote dynamic import', async () => {
  const bundler = new Bundler({ cdn: 'https://cdn.co' });
  const code = '(async () => { await import("https://cdn.co/test.js"); })();';
  const result = await bundler.build(code);
  expect(result).toContain('await import("https://cdn.co/test.js")');
});

it('should resolve relative dynamic import', async () => {
  const bundler = new Bundler({ cdn: 'https://cdn.co' });
  const code = '(async () => { await import("./test.js"); })();';
  const result = await bundler.build(code);
  expect(result).toContain('await import("https://cdn.co/test.js")');
});

it('should inline minified CSS', async () => {
  const bundler = new Bundler();
  mockResponse.body = 'body {\n  color: red;\n}';
  const code = 'import css from "https://cdn.co/test.css";\nconsole.log(css);';
  const result = await bundler.build(code);
  expect(result).toContain('body{color:red}');
});

it('should fail to resolve remote static import', async () => {
  const bundler = new Bundler();
  mockResponse.code = 500;
  const code = 'import "https://cdn.co/test.js";';
  const promise = bundler.build(code);
  await expect(promise).rejects.toThrow();
});

it('should fail outdated build', async () => {
  const bundler = new Bundler();
  const code = '';
  const promise = bundler.build(code);
  bundler.build(code);
  await expect(promise).rejects.toBeInstanceOf(OutdatedBundleError);
});
