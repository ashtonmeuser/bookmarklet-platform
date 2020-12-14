import XMLHttpRequest from './__mock__/XMLHttpRequest';
import getRequest from '../src/js/getRequest';

global.XMLHttpRequest = XMLHttpRequest;

it('should send successful GET request', async () => {
  const response = await getRequest();
  expect(response).toBe('success');
});

it('should return body of request', async () => {
  const body = 'test';
  global.responseBody = body;
  const response = await getRequest();
  expect(response).toBe(body);
});

it('should error failed request', async () => {
  global.responseStatus = 500;
  const request = getRequest();
  await expect(request).rejects.toThrowError('failed to fetch javascript with code 500');
});

it('should error non-200 status request', async () => {
  global.responseStatus = 400;
  const request = getRequest();
  await expect(request).rejects.toThrowError('failed to fetch javascript with code 400');
});
