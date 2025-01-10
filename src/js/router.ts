import { Handler, CloudFrontRequestEvent } from 'aws-lambda';

export const handler: Handler<CloudFrontRequestEvent> = async (event, _, callback) => {
  const request = event?.Records?.[0]?.cf?.request;
  if (request?.uri === '/' || request?.uri === '') return callback(null, request);
  if (request?.headers?.accept?.[0]?.value?.includes('text/html')) request.uri = '/bookmarklet.html';
  callback(null, request);
};
