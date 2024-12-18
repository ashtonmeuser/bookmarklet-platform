import Babel from './__mock__/Babel';
import XMLHttpRequest from './__mock__/XMLHttpRequest';
import Gist from '../src/js/Gist';

global.Babel = Babel;
global.XMLHttpRequest = XMLHttpRequest;

it('should create gist', () => {
  const author = 'testAuthor';
  const id = 'testId';
  const gist = new Gist(author, id);
  expect(gist).toBeInstanceOf(Gist);
  expect(gist.author).toBe(author);
  expect(gist.id).toBe(id);
});

it('should fail to create gist', () => {
  expect(() => {
    new Gist(null, null);
  }).toThrowError('invalid author or id');
});

it('should fetch gist code', async () => {
  const author = 'testAuthor';
  const id = 'testId';
  const gist = new Gist(author, id);
  await gist.fetch();
  expect(gist.code).toBe('success');
});

it('should URI encode gist code', async () => {
  const author = 'testAuthor';
  const id = 'testId';
  const code = '@#$';
  global.responseBody = code;
  const gist = new Gist(author, id);
  await gist.fetch();
  gist.transpile();
  expect(gist.href).toMatch(/%40%23%24/);
});

it('should parse gist properties', async () => {
  const author = 'testAuthor';
  const id = 'testId';
  const title = 'testTitle';
  const about = 'testAbout';
  const code = `//bookmarklet_title:${title}\n//bookmarklet_about:${about}`;
  global.responseBody = code;
  const gist = new Gist(author, id);
  await gist.fetch();
  expect(gist.title).toBe(title);
  expect(gist.about).toBe(about);
});

it('should parse gist variables', async () => {
  const author = 'testAuthor';
  const id = 'testId';
  const title = 'testTitle';
  const about = 'testAbout';
  const code = `//bookmarklet_var: test_key_0\n// bookmarklet-var :   test_key_1\n//bookmarklet_var = test_key_2`;
  global.responseBody = code;
  const gist = new Gist(author, id);
  await gist.fetch();
  expect(gist.variables).toHaveProperty('test_key_0');
  expect(gist.variables).toHaveProperty('test_key_1');
  expect(gist.variables).toHaveProperty('test_key_2');
});

it('should skip transpilation', async () => {
  const author = 'testAuthor';
  const id = 'testId';
  global.responseStatus = 500;
  const gist = new Gist(author, id);
  gist.transpile();
});

it('should fail to fetch gist code', async () => {
  const author = 'testAuthor';
  const id = 'testId';
  global.responseStatus = 500;
  const gist = new Gist(author, id);
  const request = gist.fetch();
  await expect(request).rejects.toThrowError('failed to fetch javascript with code 500');
});

it('should set size of large gist', async () => {
  const author = 'testAuthor';
  const id = 'testId';
  const code = 'a = "test test test";\n'.repeat(30);
  global.responseBody = code;
  const gist = new Gist(author, id);
  await gist.fetch();
  gist.transpile();
  expect(gist.size).toBe('1.2 kB');
});

it('should fail transpilation', async () => {
  const author = 'testAuthor';
  const id = 'testId';
  const code = 'fail';
  global.responseBody = code;
  const gist = new Gist(author, id);
  await gist.fetch();
  expect(gist.transpile.bind(gist)).toThrowError();
});
