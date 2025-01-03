import { vi } from 'vitest';

vi.mock('alpinejs', () => ({
  default: { start: vi.fn() },
}));

export default {
  init: async <T extends { init: () => void }>(dataFn: () => T, assign?: object): Promise<T> => {
    const data = dataFn();
    Object.assign(data, assign);
    await data.init();
    return data;
  },
};
