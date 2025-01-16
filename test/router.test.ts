import { vi, it, expect } from 'vitest';
import { CloudFrontRequestEvent, Context, CloudFrontHeaders } from 'aws-lambda';
import { handler } from '../src/js/router';

it('should route home', async () => {
  const request = { uri: '' };
  const event = {
    Records: [{
      cf: { request },
    }],
  } as CloudFrontRequestEvent;
  const callback = vi.fn();
  await handler(event, {} as Context, callback);
  expect(callback).toHaveBeenCalledWith(null, request);
});

it('should route bookmarklet', async () => {
  const request = {
    uri: '/test',
    headers: {
      'accept': [{ value: 'text/html' }],
    } as CloudFrontHeaders,
  };
  const event = {
    Records: [{
      cf: { request },
    }],
  } as CloudFrontRequestEvent;
  const callback = vi.fn();
  await handler(event, {} as Context, callback);
  expect(callback).toHaveBeenCalledWith(null, { ...request, uri: '/bookmarklet.html' });
});
