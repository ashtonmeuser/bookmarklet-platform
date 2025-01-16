import { vi, it, expect } from 'vitest';
import { mockResponse } from './__mock__/fetch';
import Gist from '../src/js/Gist';

it('should create gist', () => {
  const author = 'testAuthor';
  const id = 'testId';
  const gist = new Gist(author, id);
  expect(gist).toBeInstanceOf(Gist);
  expect(gist.author).toBe(author);
  expect(gist.id).toBe(id);
  expect(gist.url).toBe('https://gist.github.com/testAuthor/testId');
});

it('should create gist with optional properties', () => {
  const author = 'testAuthor';
  const id = 'testId';
  const version = '0123456789012345678901234567890123456789';
  const file = 'test.js';
  const gist = new Gist(author, id, version, file);
  expect(gist.version).toBe(version);
  expect(gist.file).toBe(file);
  expect(gist.url).toBe('https://gist.github.com/testAuthor/testId/0123456789012345678901234567890123456789');
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
  const code = 'const test = "@#$";\nconsole.log(test);';
  mockResponse.body = code;
  const gist = new Gist('testAuthor', 'testId');
  await gist.load();
  await expect.poll(() => gist.href).toMatch(/%40%23%24/);
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
  const key1 = '$$test_key_1$';
  const key2 = 'test_key_2';
  const code = `//bookmarklet_var: ${key0}\n// bookmarklet-var :   ${key1}\nconst ${key2} = 'value'; //bookmarklet_var = ${key2}`;
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
  gist.variables[key0].value = 'test_value_0';
  gist.variables[key1].value = 'test_value_1';
  expect(gist.variables[key0].value).toBe('test_value_0');
  expect(gist.variables[key1].value).toBe('test_value_1');
});

it('should parse gist password variables', async () => {
  const key0 = 'test_key_0';
  const code = `//bookmarklet_var(password): ${key0}`;
  mockResponse.body = code;
  const gist = new Gist('testAuthor', 'testId');
  await gist.load();
  expect(gist.variables[key0].type).toBe('password');
  expect(gist.variables[key0].value).toBe(null);
  gist.variables[key0].value = 'test_value_0';
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
  gist.variables[key0].value = '1.234';
  expect(gist.variables[key0].value).toBe(1.234);
  gist.variables[key0].value = '';
  expect(gist.variables[key0].value).toBe(null);
  gist.variables[key0].value = 'invalid';
  expect(gist.variables[key0].value).toBe(null);
});

it('should parse gist boolean variables', async () => {
  const key0 = 'test_key_0';
  const code = `//bookmarklet_var(boolean): ${key0}`;
  mockResponse.body = code;
  const gist = new Gist('testAuthor', 'testId');
  await gist.load();
  expect(gist.variables[key0].type).toBe('boolean');
  expect(gist.variables[key0].value).toBe(false);
  gist.variables[key0].value = 'something truthy';
  expect(gist.variables[key0].value).toBe(true);
  gist.variables[key0].value = '';
  expect(gist.variables[key0].value).toBe(false);
});

it('should parse gist special variables', async () => {
  const author = 'testAuthor';
  const id = 'testId';
  const keyAuthor = 'test_key_author';
  const keyId = 'test_key_id';
  const keyUuid = 'test_key_uuid';
  const code = `//bookmarklet_var(author): ${keyAuthor}\n//bookmarklet_var(id): ${keyId}\n//bookmarklet_var(uuid): ${keyUuid}\n`;
  mockResponse.body = code;
  const gist = new Gist(author, id);
  await gist.load();
  expect(gist.variables[keyAuthor].type).toBe('author');
  expect(gist.variables[keyAuthor].value).toBe(author);
  expect(gist.variables[keyId].type).toBe('id');
  expect(gist.variables[keyId].value).toBe(id);
  expect(gist.variables[keyUuid].type).toBe('uuid');
  expect(gist.variables[keyUuid].value).toMatch(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/);
});

it('should fail to set gist special variables', async () => {
  const author = 'testAuthor';
  const id = 'testId';
  const keyAuthor = 'test_key_author';
  const keyId = 'test_key_id';
  const keyUuid = 'test_key_uuid';
  const code = `//bookmarklet_var(author): ${keyAuthor}\n//bookmarklet_var(id): ${keyId}\n//bookmarklet_var(uuid): ${keyUuid}\n`;
  mockResponse.body = code;
  const gist = new Gist(author, id);
  await gist.load();
  gist.variables[keyAuthor].value = 'some new value';
  expect(gist.variables[keyAuthor].value).toBe(author);
  gist.variables[keyId].value = 'some new value';
  expect(gist.variables[keyId].value).toBe(id);
  gist.variables[keyUuid].value = 'some new value';
  expect(gist.variables[keyUuid].value).toMatch(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/);
});

it('should parse gist variables types regardless of casing', async () => {
  const key0 = 'test_key_0';
  const key1 = 'test_key_1';
  const key2 = 'test_key_2';
  const code = `//bookmarklet_var(TeXt): ${key0}\n//bookmarklet_var(NUMBER): ${key1}\n//bookmarklet_var(PASSword): ${key2}`;
  mockResponse.body = code;
  const gist = new Gist('testAuthor', 'testId');
  await gist.load();
  expect(gist.variables[key0].type).toBe('text');
  expect(gist.variables[key1].type).toBe('number');
  expect(gist.variables[key2].type).toBe('password');
});

it('should update gist variables', async () => {
  const key0 = 'test_key_0';
  const code = `//bookmarklet_var: ${key0}`;
  mockResponse.body = code;
  const gist = new Gist('testAuthor', 'testId');
  await gist.load();
  gist.variables[key0].value = 'test_value_0'
  gist.code = `//bookmarklet_var: ${key0}\n//more`;
  expect(gist.variables[key0].value).toBe('test_value_0');
  gist.code = `//bookmarklet_var(password): ${key0}\n//more`;
  expect(gist.variables[key0].value).toBeNull();
  gist.code = `//empty`;
  expect(gist.variables).not.haveOwnProperty(key0);
});

it('should use first gist variable definition', async () => {
  const key0 = 'test_key_0';
  const code = `//bookmarklet_var: ${key0}\n//bookmarklet_var(number): ${key0}`;
  mockResponse.body = code;
  const gist = new Gist('testAuthor', 'testId');
  await gist.load();
  expect(gist.variables[key0].type).toBe('text');
});

it('should ignore invalid variable type', async () => {
  const key0 = 'test_key_0';
  const code = `//bookmarklet_var(invalid): ${key0}`;
  mockResponse.body = code;
  const gist = new Gist('testAuthor', 'testId');
  await gist.load();
  expect(gist.variables[key0].type).toBe('text');
});

it('should skip syncing variables', async () => {
  const gist = new Gist('testAuthor', 'testId');
  gist.syncVariables();
});

it('should skip transpiling before loading', async () => {
  const gist = new Gist('testAuthor', 'testId');
  gist.transpile();
  expect(gist.href).toBeNull();
});

it('should skip transpiling duplicate code', async () => {
  const code = 'console.log("test");';
  mockResponse.body = code;
  const gist = new Gist('testAuthor', 'testId');
  const spy = vi.spyOn(gist, 'transpile');
  await gist.load();
  expect(spy).toHaveBeenCalledOnce();
  mockResponse.body = code; // Use the same code
  await gist.load();
  expect(spy).toHaveBeenCalledOnce();
});

it('should fail to fetch gist code', async () => {
  mockResponse.code = 500; // Server error
  const gist = new Gist('testAuthor', 'testId');
  let promise = gist.load();
  await expect(promise).rejects.toThrow();
  mockResponse.code = null; // Network error
  promise = gist.load();
  await expect(promise).rejects.toThrow();
});

it('should set size of gist', async () => {
  let code = `let a = "";\n${'a = "test test test";\n'.repeat(10)}`;
  mockResponse.body = code;
  const gist = new Gist('testAuthor', 'testId');
  expect(gist.size).toBe('0 B');
  await gist.load();
  await expect.poll(() => gist.size).toBe('400 B');
  code = `let a = "";\n${'a = "test test test";\n'.repeat(100)}`;
  mockResponse.body = code;
  await gist.load();
  await expect.poll(() => gist.size).toBe('3.1 kB');
});

it('should transpile TypeScript', async () => {
  const code = 'const a: string ="";\nconsole.log(a);'
  mockResponse.body = code;
  const gist = new Gist('testAuthor', 'testId');
  await gist.load();
  await expect.poll(() => gist.size).toBe('109 B');
});

it('should include banner', async () => {
  const author = 'testAuthor';
  const id = 'testId';
  const code = 'const a: string ="";\nconsole.log(a);'
  mockResponse.body = code;
  const gist = new Gist(author, id);
  await gist.load();
  await expect.poll(() => gist.href).toMatch(/bookmarkl\.ink\/testAuthor\/testId/);
});

it('should fail transpilation', async () => {
  mockResponse.body = 'const test = "';
  const gist = new Gist('testAuthor', 'testId');
  await gist.load();
  await expect.poll(() => gist.error).toBeInstanceOf(Error);
});

it('should fail to set type of gist variable', async () => {
  const key0 = 'test_key_0';
  const code = `//bookmarklet_var: ${key0}`;
  mockResponse.body = code;
  const gist = new Gist('testAuthor', 'testId');
  await gist.load();
  expect(() => {
    // @ts-expect-error
    gist.variables[key0].type = 'number';
  }).toThrow();
});
