import { vi } from 'vitest';

// See https://github.com/jsdom/jsdom/issues/3729

Object.assign(globalThis.document, {
  createRange: vi.fn(() => Object.assign(new Range(), {
    getBoundingClientRect: vi.fn(),
    getClientRects: vi.fn(() => ({ length: 0, item: () => null, [Symbol.iterator]: vi.fn() })),
  })),
});
