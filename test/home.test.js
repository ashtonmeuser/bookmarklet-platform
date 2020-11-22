import home from '../src/js/home';

it('should start with defaults', () => {
  const data = home();
  expect(data).toHaveProperty('init');
  expect(data).toHaveProperty('gistUrl');
  expect(data).toHaveProperty('bookmarkletUrl');
  expect(data).toHaveProperty('valid');
});

it('should set bookmarklet URL', () => {
  const author = 'testAuthor';
  const id = '01234567890123456789012345678901';
  const data = home();
  data.gistUrl = `https://gist.github.com/${author}/${id}`;
  expect(data.bookmarkletUrl).toBe(`/${author}/${id}`);
  expect(data.valid).toBe(true);
});

it('should set URL with version', () => {
  const author = 'testAuthor';
  const id = '01234567890123456789012345678901';
  const version = '0123456789012345678901234567890123456789';
  const data = home();
  data.gistUrl = `https://gist.github.com/${author}/${id}/${version}`;
  expect(data.bookmarkletUrl).toBe(`/${author}/${id}/${version}`);
});

it('should set URL with file', () => {
  const author = 'testAuthor';
  const id = '01234567890123456789012345678901';
  const file = 'test.js';
  const data = home();
  data.gistUrl = `https://gist.github.com/${author}/${id}/${file}`;
  expect(data.bookmarkletUrl).toBe(`/${author}/${id}//${file}`);
});

it('should have init method', () => {
  const data = home();
  expect(data.init).toBeInstanceOf(Function);
  expect(data.init()).toBe(undefined);
});

it('should fail to set bookmarklet URL', () => {
  const author = 'testAuthor';
  const id = '01234567890123456789012345678901';
  const data = home();
  data.gistUrl = `https://example.com/${author}/${id}`;
  expect(data.bookmarkletUrl).toBe(null);
  expect(data.valid).toBe(false);
});
