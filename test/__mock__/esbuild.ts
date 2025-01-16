import { vi } from 'vitest';

vi.mock('esbuild-wasm', async () => {
  const actual = await vi.importActual<typeof import('esbuild-wasm')>('esbuild-wasm');
  return {
    ...actual,
    initialize: vi.fn(async () => {}),
  };
});
