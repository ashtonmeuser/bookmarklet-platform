import { it, expect } from 'vitest';
import './__mock__/fetch';
import './__mock__/TextEncoder';
import './__mock__/esbuild';
import Playground from '../src/js/Playground';

it('should create playground', () => {
  const gist = new Playground();
  expect(gist).toBeInstanceOf(Playground);
  expect(gist.author).toBe('');
  expect(gist.id).toBe('');
  expect(gist.url).toBe('');
});

it('should load example code', async () => {
  const gist = new Playground();
  await gist.load();
  expect(globalThis.fetch).not.toHaveBeenCalled();
  expect(gist.code).toMatch(/bookmarklet-title: playground/);
});
