const parseUrl = (urlString, pathPattern, hostPattern) => {
  const url = new URL(urlString);
  if (hostPattern && !hostPattern.test(url.hostname)) throw Error('Invalid hostname');
  const matches = url.pathname.match(pathPattern);
  if (!matches) throw Error('Invalid URL');
  const [author, id, commit, file] = matches.slice(1);
  return {
    author,
    id,
    commit: commit || null,
    file: file || null,
  };
};

export const parseGistUrl = (urlString) => {
  // Should match raw and GitHub URLs; see regexr.com/5gc68
  const pathPattern = /^\/(\w+)\/([a-f0-9]{32})(?:\/raw)?(?:\/([a-f0-9]{40}))?(?:\/(.+))?$/;
  const hostPattern = /^gist\.github(?:usercontent)?\.com$/;
  return parseUrl(urlString, pathPattern, hostPattern);
};

export const parseBookmarkletUrl = (urlString) => {
  const pathPattern = /^\/(\w+)\/([a-f0-9]{32})(?:\/([a-f0-9]{40}))?(?:\/(.+))?$/;
  return parseUrl(urlString, pathPattern);
};
