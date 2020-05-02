import XMLHttpRequest from './__mock__/XMLHttpRequest';
import getRequest from '../src/js/getRequest';

global.XMLHttpRequest = XMLHttpRequest;

it('should send successful GET request', async () => {
  const response = await getRequest(null);
  expect(response).toBe('success');
});

it('should error failed request', async () => {
  const request = getRequest('failError');
  await expect(request).rejects.toThrowError('failed to fetch javascript with code 500');
});

it('should error non-200 status request', async () => {
  const request = getRequest('failStatus');
  await expect(request).rejects.toThrowError('failed to fetch javascript with code 400');
});
