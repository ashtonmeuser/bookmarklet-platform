import Babel from './__mock__/Babel';
import XMLHttpRequest from './__mock__/XMLHttpRequest';
import bookmarklet from '../src/js/bookmarklet';

global.Babel = Babel;
global.XMLHttpRequest = XMLHttpRequest;

const setLocation = (url) => {
  delete window.location;
  window.location = new URL(url);
};

it('should start with defaults', () => {
  const data = bookmarklet();
  expect(data).toHaveProperty('message');
  expect(data).toHaveProperty('error');
  expect(data).toHaveProperty('author');
  expect(data).toHaveProperty('id');
  expect(data).toHaveProperty('version');
  expect(data).toHaveProperty('file');
  expect(data).toHaveProperty('gistUrl');
  expect(data).toHaveProperty('about');
  expect(data).toHaveProperty('title');
  expect(data).toHaveProperty('href');
  expect(data).toHaveProperty('init');
});

it('should set author and ID', async () => {
  const author = 'testAuthor';
  const id = '01234567890123456789012345678901';
  setLocation(`https://bookmarkl.ink/${author}/${id}`);
  const data = bookmarklet();
  await data.init();
  expect(data.author).toBe(author);
  expect(data.id).toBe(id);
});

it('should set version', async () => {
  const author = 'testAuthor';
  const id = '01234567890123456789012345678901';
  const version = '0123456789012345678901234567890123456789';
  setLocation(`https://bookmarkl.ink/${author}/${id}/${version}`);
  const data = bookmarklet();
  await data.init();
  expect(data.version).toBe(version);
});

it('should set version', async () => {
  const author = 'testAuthor';
  const id = '01234567890123456789012345678901';
  const file = 'test.js';
  setLocation(`https://bookmarkl.ink/${author}/${id}//${file}`);
  const data = bookmarklet();
  await data.init();
  expect(data.file).toBe(file);
});

it('should set gist URL', async () => {
  const author = 'testAuthor';
  const id = '01234567890123456789012345678901';
  setLocation(`https://bookmarkl.ink/${author}/${id}`);
  const data = bookmarklet();
  await data.init();
  expect(data.gistUrl).toMatch(/gist\.github\.com/);
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
  await data.init();
  expect(data.title).toBe(title);
  expect(data.about).toBe(about);
});

it('should set javascript href', async () => {
  const author = 'testAuthor';
  const id = '01234567890123456789012345678901';
  setLocation(`https://bookmarkl.ink/${author}/${id}`);
  const data = bookmarklet();
  await data.init();
  expect(data.href).toMatch(/javascript:/);
});

it('should fail to load bookmarklet', async () => {
  global.responseStatus = 500;
  const author = 'testAuthor';
  const id = '01234567890123456789012345678901';
  setLocation(`https://bookmarkl.ink/${author}/${id}`);
  const data = bookmarklet();
  await data.init();
  expect(data.error).toBe(true);
  expect(data.message).toBe('failed to fetch javascript with code 500');
});
