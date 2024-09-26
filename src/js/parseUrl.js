const safeUrl = (urlString) => {
  try {
    return new URL(urlString);
  } catch (error) {
    throw new Error('invalid url');
  }
};

const parseUrl = (urlString, pathPattern, hostPattern) => {
  const url = safeUrl(urlString);
  if (hostPattern && !hostPattern.test(url.hostname)) throw new Error('invalid hostname');
  const matches = url.pathname.match(pathPattern);
  if (!matches) throw new Error('invalid path');
  const [author, id, version, file] = matches.slice(1);
  return {
    author,
    id,
    version: version || null,
    file: file || null,
  };
};

export const parseGistUrl = (urlString) => {
  // Should match raw and GitHub URLs; see https://regexr.com/86bok
  const pathPattern = /^\/(\w+(?:[\w-]*\w)?)\/([a-f0-9]{32})(?:\/raw)?(?:\/([a-f0-9]{40}))?(?:\/(.+))?$/;
  const hostPattern = /^gist\.github(?:usercontent)?\.com$/;
  return parseUrl(urlString, pathPattern, hostPattern);
};

export const parseBookmarkletUrl = (urlString) => {
  const pathPattern = /^\/(\w+(?:[\w-]*\w)?)\/([a-f0-9]{32})(?:\/([a-f0-9]{40})?(?:\/(.+))?)?$/;
  return parseUrl(urlString, pathPattern);
};
