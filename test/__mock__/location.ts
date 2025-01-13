import { vi } from 'vitest';

Object.assign(globalThis.window, {
  location: {
    assign: vi.fn((location) => {
      const url = new URL(location, globalThis.window.location.href);
      globalThis.window.location.href = url.href;
      globalThis.window.location.host = url.host;
      globalThis.window.location.hostname = url.hostname;
      globalThis.window.location.pathname = url.pathname;
      globalThis.window.location.hash = url.hash;
    }),
  }
})
