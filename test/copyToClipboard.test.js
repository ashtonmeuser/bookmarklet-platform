const copyToClipboard = require('../src/js/copyToClipboard');

beforeAll(() => {
  Object.defineProperties(document, {
    execCommand: {
      value: jest.fn(() => document.mockElementValue !== 'failValue'),
    },
  });
  Object.defineProperties(document.body, {
    appendChild: {
      value: jest.fn((element) => {
        document.mockElementValue = element.value;
      }),
    },
    removeChild: { value: jest.fn() },
  });
});

it('should successfully execute copy command', () => {
  expect(copyToClipboard).not.toThrow();
  expect(document.execCommand).toBeCalledWith('copy');
});

it('should error if unable to execute command', () => {
  const call = () => { copyToClipboard('failValue'); };
  expect(call).toThrowError('failed to copy to clipboard');
  expect(document.execCommand).toBeCalledWith('copy');
});
