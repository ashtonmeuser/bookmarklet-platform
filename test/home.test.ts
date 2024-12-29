import { it, expect } from 'vitest';
import Alpine from './__mock__/Alpine';
import home from '../src/js/home';

it('should start with defaults', async () => {
  const data = await Alpine.init(home);
  expect(data).toHaveProperty('init');
  expect(data).toHaveProperty('gistUrl');
  expect(data).toHaveProperty('bookmarkletUrl');
  expect(data).toHaveProperty('valid');
});

it('should set bookmarklet URL', async () => {
  const author = 'testAuthor';
  const id = '01234567890123456789012345678901';
  const data = await Alpine.init(home);
  data.gistUrl = `https://gist.github.com/${author}/${id}`;
  expect(data.bookmarkletUrl).toBe(`/${author}/${id}`);
  expect(data.valid).toBe(true);
});

it('should set URL with version', async () => {
  const author = 'testAuthor';
  const id = '01234567890123456789012345678901';
  const version = '0123456789012345678901234567890123456789';
  const data = await Alpine.init(home);
  data.gistUrl = `https://gist.github.com/${author}/${id}/${version}`;
  expect(data.bookmarkletUrl).toBe(`/${author}/${id}/${version}`);
});

it('should set URL with file', async () => {
  const author = 'testAuthor';
  const id = '01234567890123456789012345678901';
  const file = 'test.js';
  const data = await Alpine.init(home);
  data.gistUrl = `https://gist.github.com/${author}/${id}/${file}`;
  expect(data.bookmarkletUrl).toBe(`/${author}/${id}//${file}`);
});

it('should have init method', async () => {
  const data = await Alpine.init(home);
  expect(data.init).toBeInstanceOf(Function);
  expect(data.init()).toBe(undefined);
});

it('should fail to set bookmarklet URL', async () => {
  const author = 'testAuthor';
  const id = '01234567890123456789012345678901';
  const data = await Alpine.init(home);
  data.gistUrl = `https://example.com/${author}/${id}`;
  expect(data.bookmarkletUrl).toBe(null);
  expect(data.valid).toBe(false);
});
