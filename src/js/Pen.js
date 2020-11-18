const getPenProperty = (penCode, property) => {
  const propertyRegex = new RegExp(`//[\\s\\t]*bookmarklet[-_]${property}[\\s\\t]*[:=][\\s\\t]*(.+)`, 'i');
  const matches = penCode.match(propertyRegex);

  return matches !== null ? matches[1] : `no ${property}`;
};

const parsePenCode = (response) => {
  try {
    const { code } = Babel.transform(response, { presets: ['es2015'], minified: true });
    return encodeURIComponent(code);
  } catch (error) {
    throw new Error('could not parse javascript');
  }
};

export default class Pen {
  constructor(author, id, raw) {
    this.author = author;
    this.id = id;
    this.title = getPenProperty(raw, 'title');
    this.about = getPenProperty(raw, 'about');
    this.code = parsePenCode(raw);
  }
}
