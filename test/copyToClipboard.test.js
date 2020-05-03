import copyToClipboard from '../src/js/copyToClipboard';

beforeAll(() => {
  document.execCommand = jest.fn(() => document.mockElementValue !== 'failValue');
  document.body.appendChild = jest.fn((e) => { document.mockElementValue = e.value; });
  document.body.removeChild = jest.fn();
});

it('should successfully execute copy command', () => {
  expect(copyToClipboard).not.toThrow();
  expect(document.execCommand).toBeCalledWith('copy');
});

it('should error if unable to execute command', () => {
  expect(() => copyToClipboard('failValue')).toThrowError('failed to copy to clipboard');
  expect(document.execCommand).toBeCalledWith('copy');
});

it('should set up and tear down element', () => {
  expect(copyToClipboard).not.toThrow();
  expect(document.body.appendChild).toBeCalled();
  expect(document.body.removeChild).toBeCalled();
});
