import BookmarkletError from './error';

type UrlProperties = {
  author: string;
  id: string;
  version?: string;
  file?: string;
}

const safeUrl = (url: string): URL => {
  try {
    return new URL(url);
  } catch (error) {
    throw new BookmarkletError(400, 'invalid url');
  }
};

const parseUrl = (urlString: string, pathPattern: RegExp, hostPattern?: RegExp): UrlProperties => {
  const url = safeUrl(urlString);
  if (hostPattern && !hostPattern.test(url.hostname)) throw new BookmarkletError(400, 'invalid hostname');
  const matches = url.pathname.match(pathPattern);
  if (!matches) throw new BookmarkletError(400, 'invalid path');
  const [author, id, version, file] = matches.slice(1);
  return {
    author,
    id,
    version: version || undefined,
    file: file || undefined,
  };
};

export const parseGistUrl = (urlString: string): UrlProperties => {
  // Should match raw and GitHub URLs; see https://regexr.com/86bok
  const pathPattern = /^\/(\w+(?:[\w-]*\w)?)\/([a-f0-9]{32})(?:\/raw)?(?:\/([a-f0-9]{40})?)?(?:\/(.+?)?)?\/?$/;
  const hostPattern = /^gist\.github(?:usercontent)?\.com$/;
  return parseUrl(urlString, pathPattern, hostPattern);
};

export const parseBookmarkletUrl = (urlString: string): UrlProperties => {
  const pathPattern = /^\/(\w+(?:[\w-]*\w)?)\/([a-f0-9]{32})(?:\/([a-f0-9]{40})?)?(?:\/(.+?)?)?\/?$/;
  return parseUrl(urlString, pathPattern);
};
