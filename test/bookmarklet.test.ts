import { it, expect } from 'vitest';
import { mockResponse } from './__mock__/fetch';
import './__mock__/TextEncoder';
import './__mock__/esbuild';
import './__mock__/location';
import './__mock__/clipboard';
import './__mock__/document';
import Alpine from './__mock__/Alpine';
import bookmarklet from '../src/js/bookmarklet';
import Gist from '../src/js/Gist';
import Playground from '../src/js/Playground';
import BookmarkletError from '../src/js/error';

it('should start with defaults', async () => {
  const data = await Alpine.init(bookmarklet);
  expect(data).toHaveProperty('init');
  expect(data.gist).toBeNull();
  expect(data.error).toBeInstanceOf(Error);
  expect(data.edit).toBe(false);
});

it('should set author and ID', async () => {
  const author = 'testAuthor';
  const id = '01234567890123456789012345678901';
  window.location.assign(`https://bookmarkl.ink/${author}/${id}`);
  const data = await Alpine.init(bookmarklet);
  expect(data.gist?.author).toBe(author);
  expect(data.gist?.id).toBe(id);
});

it('should set version', async () => {
  const author = 'testAuthor';
  const id = '01234567890123456789012345678901';
  const version = '0123456789012345678901234567890123456789';
  window.location.assign(`https://bookmarkl.ink/${author}/${id}/${version}`);
  const data = await Alpine.init(bookmarklet);
  expect(data.gist?.version).toBe(version);
});

it('should set version', async () => {
  const author = 'testAuthor';
  const id = '01234567890123456789012345678901';
  const file = 'test.js';
  window.location.assign(`https://bookmarkl.ink/${author}/${id}//${file}`);
  const data = await Alpine.init(bookmarklet);
  expect(data.gist?.file).toBe(file);
});

it('should set gist URL', async () => {
  const author = 'testAuthor';
  const id = '01234567890123456789012345678901';
  window.location.assign(`https://bookmarkl.ink/${author}/${id}`);
  const data = await Alpine.init(bookmarklet);
  expect(data.gist?.url).toMatch(/gist\.github\.com/);
});

it('should set title and about', async () => {
  const author = 'testAuthor';
  const id = '01234567890123456789012345678901';
  window.location.assign(`https://bookmarkl.ink/${author}/${id}`);
  const title = 'testTitle';
  const about = 'testAbout';
  const code = `//bookmarklet_title:${title}\n//bookmarklet_about:${about}`;
  mockResponse.body = code;
  const data = await Alpine.init(bookmarklet);
  expect(data.gist?.title).toBe(title);
  expect(data.gist?.about).toBe(about);
});

it('should set javascript href', async () => {
  const author = 'testAuthor';
  const id = '01234567890123456789012345678901';
  window.location.assign(`https://bookmarkl.ink/${author}/${id}`);
  const code = 'const test = 1234;';
  mockResponse.body = code;
  const data = await Alpine.init(bookmarklet);
  expect(data.gist?.author).toBe(author);
  await expect.poll(() => data.gist?.href).toMatch(/javascript:/);
});

it('should copy javascript href', async () => {
  const author = 'testAuthor';
  const id = '01234567890123456789012345678901';
  window.location.assign(`https://bookmarkl.ink/${author}/${id}`);
  const code = 'const test = 1234;';
  mockResponse.body = code;
  const data = await Alpine.init(bookmarklet);
  await expect.poll(() => data.gist?.href).toMatch(/javascript:/);
  data.copy();
  expect(globalThis.navigator.clipboard.writeText).toHaveBeenCalled();
});

it('should vary href based on variables', async () => {
  const key0 = 'test_key_0';
  const author = 'testAuthor';
  const id = '01234567890123456789012345678901';
  window.location.assign(`https://bookmarkl.ink/${author}/${id}`);
  const code = `//bookmarklet_var: ${key0}\nconsole.log(${key0});`;
  mockResponse.body = code;
  const data = await Alpine.init(bookmarklet);
  expect(data.gist).toBeInstanceOf(Gist);
  const gist = data.gist as Gist;
  await expect.poll(() => gist.href).toMatch(/javascript:/);
  expect(gist.variables[key0].value).toBe(null);
  const old = gist.href;
  gist.variables[key0].value = 'test_value_0';
  await expect.poll(() => gist.href).not.toBe(old);
});

it('should default to editing', async () => {
  const author = 'testAuthor';
  const id = '01234567890123456789012345678901';
  window.location.assign(`https://bookmarkl.ink/${author}/${id}`);
  window.location.hash = '#edit';
  const data = await Alpine.init(bookmarklet);
  expect(data.edit).toBe(true);
});

it('should load playground', async () => {
  window.location.assign(`https://bookmarkl.ink/playground`);
  const data = await Alpine.init(bookmarklet);
  expect(data.edit).toBe(true);
  expect(data.gist).toBeInstanceOf(Playground);
  expect(data.gist?.title).toBe('playground');
});

it('should fail to load bookmarklet', async () => {
  mockResponse.code = 500;
  const author = 'testAuthor';
  const id = '01234567890123456789012345678901';
  window.location.assign(`https://bookmarkl.ink/${author}/${id}`);
  const data = await Alpine.init(bookmarklet);
  expect(data.error).toBeInstanceOf(BookmarkletError);
  expect(data.error?.code).toBe(500);
  expect(data.error?.message).toBe('failed to fetch javascript code');
});

it('should fail to transpile bookmarklet', async () => {
  const author = 'testAuthor';
  const id = '01234567890123456789012345678901';
  window.location.assign(`https://bookmarkl.ink/${author}/${id}`);
  const code = 'const test = "';
  mockResponse.body = code;
  const data = await Alpine.init(bookmarklet, { $refs: {} });
  expect(data.error).toBeNull();
  await expect.poll(() => data.gist?.error).toBeInstanceOf(Error);
});
