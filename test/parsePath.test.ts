import { it, expect } from 'vitest';
import { parseGistPath, parseBookmarkletPath } from '../src/js/parsePath';

it('should parse bookmarklet URL', () => {
  const author = 'testAuthor';
  const id = '01234567890123456789012345678901';
  const url = `https://bookmarkl.ink/${author}/${id}`;
  const parsed = parseBookmarkletPath(url);
  expect(parsed.author).toBe(author);
  expect(parsed.id).toBe(id);
});

it('should parse bookmarklet URL with trailing slash', () => {
  const author = 'testAuthor';
  const id = '01234567890123456789012345678901';
  const url = `https://bookmarkl.ink/${author}/${id}/`;
  const parsed = parseBookmarkletPath(url);
  expect(parsed.author).toBe(author);
  expect(parsed.id).toBe(id);
});

it('should parse bookmarklet version', () => {
  const author = 'testAuthor';
  const id = '01234567890123456789012345678901';
  const version = '0123456789012345678901234567890123456789';
  const url = `https://bookmarkl.ink/${author}/${id}/${version}`;
  const parsed = parseBookmarkletPath(url);
  expect(parsed.version).toBe(version);
});

it('should parse bookmarklet file with blank version', () => {
  const author = 'testAuthor';
  const id = '01234567890123456789012345678901';
  const file = 'test.js';
  const url = `https://bookmarkl.ink/${author}/${id}//${file}`;
  const parsed = parseBookmarkletPath(url);
  expect(parsed.file).toBe(file);
});

it('should parse bookmarklet file with missing version', () => {
  const author = 'testAuthor';
  const id = '01234567890123456789012345678901';
  const file = 'test.js';
  const url = `https://bookmarkl.ink/${author}/${id}/${file}`;
  const parsed = parseBookmarkletPath(url);
  expect(parsed.file).toBe(file);
});

it('should parse bookmarklet version and file', () => {
  const author = 'testAuthor';
  const id = '01234567890123456789012345678901';
  const version = '0123456789012345678901234567890123456789';
  const file = 'test.js';
  const url = `https://bookmarkl.ink/${author}/${id}/${version}/${file}`;
  const parsed = parseBookmarkletPath(url);
  expect(parsed.file).toBe(file);
});

it('should parse bookmarklet version and file with trailing slash', () => {
  const author = 'testAuthor';
  const id = '01234567890123456789012345678901';
  const version = '0123456789012345678901234567890123456789';
  const file = 'test.js';
  const url = `https://bookmarkl.ink/${author}/${id}/${version}/${file}/`;
  const parsed = parseBookmarkletPath(url);
  expect(parsed.file).toBe(file);
});

it('should parse github.com URL', () => {
  const author = 'testAuthor';
  const id = '01234567890123456789012345678901';
  const url = `https://gist.github.com/${author}/${id}`;
  const parsed = parseGistPath(url);
  expect(parsed.author).toBe(author);
  expect(parsed.id).toBe(id);
});

it('should parse githubusercontent.com URL', () => {
  const author = 'testAuthor';
  const id = '01234567890123456789012345678901';
  const url = `https://gist.githubusercontent.com/${author}/${id}`;
  const parsed = parseGistPath(url);
  expect(parsed.author).toBe(author);
  expect(parsed.id).toBe(id);
});

it('should parse author and ID with trailing slash', () => {
  const author = 'testAuthor';
  const id = '01234567890123456789012345678901';
  const url = `https://gist.githubusercontent.com/${author}/${id}/`;
  const parsed = parseGistPath(url);
  expect(parsed.author).toBe(author);
  expect(parsed.id).toBe(id);
});

it('should parse gist version', () => {
  const author = 'testAuthor';
  const id = '01234567890123456789012345678901';
  const version = '0123456789012345678901234567890123456789';
  const url = `https://gist.github.com/${author}/${id}/${version}/`;
  const parsed = parseGistPath(url);
  expect(parsed.version).toBe(version);
});

it('should parse gist file', () => {
  const author = 'testAuthor';
  const id = '01234567890123456789012345678901';
  const file = 'test.js';
  const url = `https://gist.github.com/${author}/${id}/${file}`;
  const parsed = parseGistPath(url);
  expect(parsed.file).toBe(file);
});

it('should parse gist version and file', () => {
  const author = 'testAuthor';
  const id = '01234567890123456789012345678901';
  const version = '0123456789012345678901234567890123456789';
  const file = 'test.js';
  const url = `https://gist.github.com/${author}/${id}/${version}/${file}`;
  const parsed = parseGistPath(url);
  expect(parsed.version).toBe(version);
  expect(parsed.file).toBe(file);
});

it('should parse gist version and file with trailing slash', () => {
  const author = 'testAuthor';
  const id = '01234567890123456789012345678901';
  const version = '0123456789012345678901234567890123456789';
  const file = 'test.js';
  const url = `https://gist.github.com/${author}/${id}/${version}/${file}/`;
  const parsed = parseGistPath(url);
  expect(parsed.version).toBe(version);
  expect(parsed.file).toBe(file);
});

it('should fail invalid bookmarklet ID', () => {
  const author = 'testAuthor';
  const id = 'testId';
  const url = `https://bookmarkl.ink/${author}/${id}`;
  expect(() => {
    parseBookmarkletPath(url);
  }).toThrow('invalid path');
});

it('should fail to parse invalid URL', () => {
  const url = '';
  expect(() => {
    parseGistPath(url);
  }).toThrow('invalid url');
});

it('should fail to parse invalid hostname', () => {
  const url = 'https://example.com';
  expect(() => {
    parseGistPath(url);
  }).toThrow('invalid hostname');
});

it('should fail to parse invalid path', () => {
  const url = 'https://gist.github.com';
  expect(() => {
    parseGistPath(url);
  }).toThrow('invalid path');
});
