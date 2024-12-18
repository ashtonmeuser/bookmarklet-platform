import Babel from './__mock__/Babel';
import XMLHttpRequest from './__mock__/XMLHttpRequest';
import Alpine from './__mock__/Alpine';
import bookmarklet from '../src/js/bookmarklet';

global.Babel = Babel;
global.XMLHttpRequest = XMLHttpRequest;

const setLocation = (url) => {
  delete window.location;
  window.location = new URL(url);
};

it('should start with defaults', () => {
  const data = bookmarklet();
  expect(data).toHaveProperty('init');
  expect(data).toHaveProperty('gist');
  expect(data).toHaveProperty('error');
});

it('should set author and ID', async () => {
  const author = 'testAuthor';
  const id = '01234567890123456789012345678901';
  setLocation(`https://bookmarkl.ink/${author}/${id}`);
  const data = bookmarklet();
  await Alpine.init(data);
  expect(data.gist.author).toBe(author);
  expect(data.gist.id).toBe(id);
});

it('should set version', async () => {
  const author = 'testAuthor';
  const id = '01234567890123456789012345678901';
  const version = '0123456789012345678901234567890123456789';
  setLocation(`https://bookmarkl.ink/${author}/${id}/${version}`);
  const data = bookmarklet();
  await Alpine.init(data);
  expect(data.gist.version).toBe(version);
});

it('should set version', async () => {
  const author = 'testAuthor';
  const id = '01234567890123456789012345678901';
  const file = 'test.js';
  setLocation(`https://bookmarkl.ink/${author}/${id}//${file}`);
  const data = bookmarklet();
  await Alpine.init(data);
  expect(data.gist.file).toBe(file);
});

it('should set gist URL', async () => {
  const author = 'testAuthor';
  const id = '01234567890123456789012345678901';
  setLocation(`https://bookmarkl.ink/${author}/${id}`);
  const data = bookmarklet();
  await Alpine.init(data);
  expect(data.gist.url).toMatch(/gist\.github\.com/);
});

it('should set title and about', async () => {
  const author = 'testAuthor';
  const id = '01234567890123456789012345678901';
  setLocation(`https://bookmarkl.ink/${author}/${id}`);
  const title = 'testTitle';
  const about = 'testAbout';
  const code = `//bookmarklet_title:${title}\n//bookmarklet_about:${about}`;
  global.responseBody = code;
  const data = bookmarklet();
  await Alpine.init(data);
  expect(data.gist.title).toBe(title);
  expect(data.gist.about).toBe(about);
});

it('should set javascript href', async () => {
  const author = 'testAuthor';
  const id = '01234567890123456789012345678901';
  setLocation(`https://bookmarkl.ink/${author}/${id}`);
  const data = bookmarklet();
  await Alpine.init(data);
  expect(data.gist.href).toMatch(/javascript:/);
});

it('should vary href based on variables', async () => {
  const author = 'testAuthor';
  const id = '01234567890123456789012345678901';
  setLocation(`https://bookmarkl.ink/${author}/${id}`);
  const code = '//bookmarklet_var: test_key';
  global.responseBody = code;
  const data = bookmarklet();
  await Alpine.init(data);
  expect(data.gist.href).toMatch(/javascript:/);
  expect(data.gist.variables.test_key).toBe('');
  const old = data.gist.href;
  data.gist.variables.test_key = 'test_value';
  Alpine.fireWatchers();
  expect(data.gist.href).not.toBe(old);
});

it('should fail to load bookmarklet', async () => {
  global.responseStatus = 500;
  const author = 'testAuthor';
  const id = '01234567890123456789012345678901';
  setLocation(`https://bookmarkl.ink/${author}/${id}`);
  const data = bookmarklet();
  await Alpine.init(data);
  expect(data.error).toBeInstanceOf(Error);
  expect(data.error.message).toBe('failed to fetch javascript with code 500');
});

it('should fail to transpile bookmarklet', async () => {
  const author = 'testAuthor';
  const id = '01234567890123456789012345678901';
  setLocation(`https://bookmarkl.ink/${author}/${id}`);
  const code = `fail`;
  global.responseBody = code;
  const data = bookmarklet();
  await Alpine.init(data);
  expect(data.error).toBeInstanceOf(Error);
  expect(data.error.message).toBe('failed to transpile javascript code');
});
