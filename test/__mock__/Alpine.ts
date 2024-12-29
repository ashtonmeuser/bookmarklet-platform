import { vi } from 'vitest';

vi.mock('alpinejs', () => ({
  default: { start: vi.fn() },
}));

export default {
  init: async <T extends { init: () => void }>(dataFn: () => T): Promise<T> => {
    const data = dataFn();
    await data.init();
    return data;
  },
};
