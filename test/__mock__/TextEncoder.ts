class ESBuildAndJSDOMCompatibleTextEncoder extends TextEncoder {
  constructor() {
    super();
  }

  encode(input: string): Uint8Array {
    if (typeof input !== 'string') throw new TypeError('input must be a string');
    const decodedURI = decodeURIComponent(encodeURIComponent(input));
    const arr = new Uint8Array(decodedURI.length);
    const chars = decodedURI.split('');
    for (let i = 0; i < chars.length; i++) arr[i] = decodedURI[i].charCodeAt(0);
    return arr;
  }
}

Object.assign(globalThis, { TextEncoder: ESBuildAndJSDOMCompatibleTextEncoder });
