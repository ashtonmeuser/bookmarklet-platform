import { vi } from 'vitest';

type MockResponse = {
  code?: number | null; // Code null throws; non-2xx code resolves with ok = false
  body?: string;
}

export const mockResponse: MockResponse = {};

function reset(): void {
  mockResponse.code = undefined;
  mockResponse.body = undefined;
}

Object.assign(global, {
  fetch: vi.fn(() => {
    if (mockResponse.code === null) return Promise.reject().finally(reset);
    const text = mockResponse.body || '';
    return Promise.resolve({
      ok: mockResponse.code === undefined || (mockResponse.code >= 200 && mockResponse.code < 300),
      status: mockResponse.code,
      text: () => Promise.resolve(text),
    }).finally(reset);
  }),
});
