global.Babel = require('./__mock__/Babel');
const Pen = require('../src/js/Pen');

it('should create pen', () => {
  const author = 'testAuthor';
  const id = 'testId';
  const code = 'testIdCode';
  const pen = new Pen(author, id, code);
  expect(pen).toBeInstanceOf(Pen);
  expect(pen.author).toBe(author);
  expect(pen.id).toBe(id);
  expect(pen.code).toBe(code);
});

it('should URI encode pen code', () => {
  const code = '@#$%^&+';
  const encoded = '%40%23%24%25%5E%26%2B';
  const pen = new Pen(null, null, code);
  expect(pen.code).toBe(encoded);
});

it('should parse pen properties', () => {
  const title = 'testTitle';
  const about = 'testAbout';
  const code = `//bookmarklet_title:${title}\n//bookmarklet_about:${about}`;
  const pen = new Pen(null, null, code);
  expect(pen.title).toBe(title);
  expect(pen.about).toBe(about);
});

it('should fail to parse code', () => {
  const code = 'fail';
  expect(() => {
    new Pen(null, null, code); // eslint-disable-line no-new
  }).toThrowError('could not parse codepen javascript');
});
