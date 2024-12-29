import { it, expect } from 'vitest';
import { mockResponse } from './__mock__/fetch';
import Gist from '../src/js/Gist';

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
    // @ts-expect-error
    new Gist(null, null);
  }).toThrow('invalid author or id');
});

it('should fetch gist code', async () => {
  const gist = new Gist('testAuthor', 'testId');
  await gist.load();
  expect(global.fetch).toHaveBeenCalled();
  expect(gist.code).toBe('');
});

it('should URI encode gist code', async () => {
  const code = 'const test = "@#$"';
  mockResponse.body = code;
  const gist = new Gist('testAuthor', 'testId');
  await gist.load();
  gist.transpile();
  expect(gist.href).toMatch(/%40%23%24/);
});

it('should parse gist properties', async () => {
  const title = 'testTitle';
  const about = 'testAbout';
  const code = `//bookmarklet_title:${title}\n//bookmarklet_about:${about}`;
  mockResponse.body = code;
  const gist = new Gist('testAuthor', 'testId');
  await gist.load();
  expect(gist.title).toBe(title);
  expect(gist.about).toBe(about);
});

it('should parse gist variables', async () => {
  const key0 = 'test_key_0';
  const key1 = 'test_key_1';
  const key2 = 'test_key_2';
  const code = `//bookmarklet_var: ${key0}\n// bookmarklet-var :   ${key1}\n//bookmarklet_var = ${key2}`;
  mockResponse.body = code;
  const gist = new Gist('testAuthor', 'testId');
  await gist.load();
  expect(gist.variables).toHaveProperty(key0);
  expect(gist.variables).toHaveProperty(key1);
  expect(gist.variables).toHaveProperty(key2);
});

it('should parse gist text variables', async () => {
  const key0 = 'test_key_0';
  const key1 = 'test_key_1';
  const code = `//bookmarklet_var: ${key0}\n//bookmarklet_var(text): ${key1}`;
  mockResponse.body = code;
  const gist = new Gist('testAuthor', 'testId');
  await gist.load();
  expect(gist.variables[key0].type).toBe('text');
  expect(gist.variables[key0].value).toBe(null);
  expect(gist.variables[key1].type).toBe('text');
  expect(gist.variables[key1].value).toBe(null);
  gist.variables[key0].value = 'test_value_0'
  gist.variables[key1].value = 'test_value_1'
  expect(gist.variables[key0].value).toBe('test_value_0');
  expect(gist.variables[key1].value).toBe('test_value_1');
});

it('should parse gist password variables', async () => {
  const key0 = 'test_key_0';
  const code = `//bookmarklet_var(password): test_key_0`;
  mockResponse.body = code;
  const gist = new Gist('testAuthor', 'testId');
  await gist.load();
  expect(gist.variables[key0].type).toBe('password');
  expect(gist.variables[key0].value).toBe(null);
  gist.variables[key0].value = 'test_value_0'
  expect(gist.variables[key0].value).toBe('test_value_0');
});

it('should parse gist number variables', async () => {
  const key0 = 'test_key_0';
  const code = `//bookmarklet_var(number): ${key0}`;
  mockResponse.body = code;
  const gist = new Gist('testAuthor', 'testId');
  await gist.load();
  expect(gist.variables[key0].type).toBe('number');
  expect(gist.variables[key0].value).toBe(null);
  gist.variables[key0].value = '1.234'
  expect(gist.variables[key0].value).toBe(1.234);
  gist.variables[key0].value = ''
  expect(gist.variables[key0].value).toBe(null);
  gist.variables[key0].value = 'invalid'
  expect(gist.variables[key0].value).toBe(null);
});

it('should skip transpilation', async () => {
  mockResponse.code = 500;
  const gist = new Gist('testAuthor', 'testId');
  gist.transpile();
});

it('should fail to fetch gist code', async () => {
  mockResponse.code = 500; // Server error
  const gist = new Gist('testAuthor', 'testId');
  let request = gist.load();
  await expect(request).rejects.toThrow();
  mockResponse.code = null; // Network error
  request = gist.load();
  await expect(request).rejects.toThrow();
});

it('should set size of gist', async () => {
  let code = `let a = "";\n${'a = "test test test";\n'.repeat(10)}`;
  mockResponse.body = code;
  const gist = new Gist('testAuthor', 'testId');
  await gist.load();
  expect(gist.size).toBe('0 B');
  gist.transpile();
  expect(gist.size).toBe('378 B');
  code = `let a = "";\n${'a = "test test test";\n'.repeat(100)}`;
  mockResponse.body = code;
  await gist.load();
  gist.transpile();
  expect(gist.size).toBe('3.1 kB');
});

it('should fail transpilation', async () => {
  mockResponse.body = 'const test = "';
  const gist = new Gist('testAuthor', 'testId');
  await gist.load();
  expect(gist.transpile.bind(gist)).toThrow(); // Change if transpile becomes async
});

it('should fail to set type of gist variable', async () => {
  const key0 = 'test_key_0';
  const code = `//bookmarklet_var: ${key0}`;
  mockResponse.body = code;
  const gist = new Gist('testAuthor', 'testId');
  await gist.load();
  gist.transpile();
  expect(() => {
    // @ts-expect-error
    gist.variables[key0].type = 'number';
  }).toThrow();
});
