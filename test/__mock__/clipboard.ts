import { vi } from 'vitest';

Object.assign(globalThis.navigator, {
  clipboard: {
    writeText: vi.fn().mockResolvedValue(undefined),
  },
});
