# Bookmarklet Platform

A platform for building and distributing JavaScript gists as bookmarklets. Observable in the wild [here](https://bookmarkl.ink).

## Background

### Bookmarklets

[Wikipedia](https://en.wikipedia.org/wiki/Bookmarklet) describes bookmarklets are described as follows:

> A bookmarklet is a bookmark stored in a web browser that contains JavaScript commands that add new features to the browser.

Bookmarklets are saved in the same way as standard website bookmarks. However, rather than navigating to a new website when the bookmark is clicked, a bookmarklet runs JavaScript code. This code is executed on the current website displayed by the browser and can have any number of effects. Examples might include sharing the current site to a social media platform, shortening a URL, or translating the language of the current website's text.

### Gists

[Gist](https://gist.github.com) is a GitHub feature that provides [pastebin](https://en.wikipedia.org/wiki/Pastebin)-like functionality. Users can create code snippets called *gists*. This differs from GitHub itself which is used to host entire projects.

Gist is unique in that it creates each gist as an individual [git repository](https://git-scm.com). That means that support for multiple files, versioning, and forking is built in.

## Using the Application

### Creating a Bookmarklet

The bookmarkl.ink application can be used to generate and share bookmarklets.

Before beginning, note that a GitHub account is required. If you don't have an account with GitHub, register [here](https://github.com/join).

To create a bookmarklet, first [create a GitHub gist](https://gist.github.com) containing the intended source code for your bookmarklet. Once saved, copy the URL of your gist. If you'd like to simply test the application, you can create a gist with the following content.

```js
window.alert("Hello, World!");
```

Navigate to [bookmarkl.ink](https://bookmarkl.ink) and paste the gist URL into the input on the bottom of the page. Click the "Create" button. The resultant page is your generated bookmarklet. Clicking the button at the bottom of the page will run your bookmarklet's JavaScript source code. In many desktop web browsers, the bookmarklet can be saved by dragging the button to the browser's toolbar, typically just below the URL bar.

The URL can be shared to allow others to run and/or save your bookmarklet.

### Customizing a Bookmarklet

To add a title to the bookmarklet, include `// bookmarklet-title: [TITLE]` in your gist, replacing `[TITLE]` with your desired title. Similarly, a description for the bookmarklet can be added with `// bookmarklet-about: [ABOUT]`.

To link to a specific version of the GitHub gist source code, you'll first need to get the commit hash from GitHub. One way to accomplish this is to view the raw source of your gist using the "•••" button in GitHub. In the URL, you should find a commit hash of 40 hexadecimal characters. A bookmarklet can be locked to this version of the source code by modifying the bookmarklet URL to the format `bookmarkl.ink/[USERNAME]/[ID]/[COMMIT]`, replacing the `[USERNAME]`, `[ID]`, and `[COMMIT]` placeholders with your gist's values.

If you've created a multi-file gist, you can ensure your bookmarklet pulls its source code from a specific file by modifying the bookmarklet URL to the format `bookmarkl.ink/[USERNAME]/[ID]/[FILE]`, replacing the `[USERNAME]`, `[ID]`, and `[FILE]` placeholders with yours. The optional version commit hash can be excluded entirely (`bookmarkl.ink/[USERNAME]/[ID]/[FILE]`), included (`bookmarkl.ink/[USERNAME]/[ID]/[COMMIT]/[FILE]`), or left blank (`bookmarkl.ink/[USERNAME]/[ID]//[FILE]`).

### Including Variables

If your bookmarklet requires further customization by the end user, you may include variables to be manually entered and compiled into the bookmarklet code. These can be included via comment in your gist in the format `// bookmarklet-var: [VARIABLE_NAME]`. Upon modifying variables at Bookmarkl.ink, variables are hard-coded into the compiled bookmarklet which can then be saved to your bookmarks.

By default, variables are all strings, i.e. text inputs. You can force the input to be numeric or censored using `// bookmarklet-var(number): [VARIABLE_NAME]` and `// bookmarklet-var(password): [VARIABLE_NAME]`, respectively. Numeric variables are injected into the script as numbers while passwords are injected as strings.

There also exist special values that can be injected into a bookmarklet. You can access the gist author and ID via `// bookmarklet-var(author): [VARIABLE_NAME]` and `// bookmarklet-var(id): [VARIABLE_NAME]`, respectively. You can access a Universally Unique Identifier (UUID v4) via `// bookmarklet-var(uuid): [VARIABLE_NAME]`.

The following variable types are supported.

Type | Description
-- | --
`text` | Text input field injected as a string
`password` | Password input field (i.e., censored) injected as a string
`number` | Numeric input field injected as a number
`boolean` | Checkbox input field injected as a boolean
`author` | Author ID injected as a string; not editable
`id` | Gist ID injected as a string; not editable
`uuid` | UUID injected as a string at build time; not editable

## Examples

Several example gists can be found [here](https://gist.github.com/ashtonmeuser/21427841853c9f2292c8f7d7af0079ea/). For the sake of completeness, these examples (and more) are highlighted bellow.

Gist | Bookmarkl.ink | Description
--|--|--
[count.js](https://gist.github.com/ashtonmeuser/21427841853c9f2292c8f7d7af0079ea/#file-count-js) | [Word Frequency](https://bookmarkl.ink/ashtonmeuser/21427841853c9f2292c8f7d7af0079ea/count.js) | A simple example showing a bookmarklet reading the content of whatever page it was called on. In this case, basic word frequency is shown.
[emoji.js](https://gist.github.com/ashtonmeuser/21427841853c9f2292c8f7d7af0079ea/#file-emoji-js) | [Emoji!](https://bookmarkl.ink/ashtonmeuser/21427841853c9f2292c8f7d7af0079ea/emoji.js) | Adds a random emoji at a random position within the current website.
[focus.js](https://gist.github.com/ashtonmeuser/21427841853c9f2292c8f7d7af0079ea/#file-focus-js) | [img--](https://bookmarkl.ink/ashtonmeuser/21427841853c9f2292c8f7d7af0079ea/focus.js) | Dims images until mouse hover.
[qr.js](https://gist.github.com/ashtonmeuser/21427841853c9f2292c8f7d7af0079ea/#file-qr-js) | [QR Code](https://bookmarkl.ink/ashtonmeuser/21427841853c9f2292c8f7d7af0079ea/qr.js) | Creates a QR that links to the web page currently being viewed.
[variables.js](https://gist.github.com/ashtonmeuser/21427841853c9f2292c8f7d7af0079ea/#file-variables-js) | [Test Variables](https://bookmarkl.ink/ashtonmeuser/21427841853c9f2292c8f7d7af0079ea/variables.js) | Showcases a bookmarklet requiring variables. These variables can be edited directly in Bookmarkl.ink and are then compiled into the bookmarklet code.
[_import.ts](https://gist.github.com/ashtonmeuser/39e0cb3f2472cb8980726fb6c7d6d349) | [ESM Imports](https://bookmarkl.ink/ashtonmeuser/39e0cb3f2472cb8980726fb6c7d6d349) | Showcases importing remote and relative ESM modules. Also demonstrates bundling of different content types as well as specification of a custom loader.

## Design

### Technology Stack

Bookmarkl.ink is hosted as a [static site](https://en.wikipedia.org/wiki/Static_web_page) i.e. files are served unaltered to all viewers. The static site is hosted in an [AWS S3](https://aws.amazon.com/s3/) bucket. To enable caching, the bucket is behind an [AWS CloudFront](https://aws.amazon.com/cloudfront/) distribution.

Bookmarkl.ink uses [AlpineJS](https://alpinejs.dev) as a frontend framework.

In order to reuse parts of markup, [Pug](https://pugjs.org/api/getting-started.html) is used. This allows writing small, reusable templates that are translated into HTML. [SASS](https://sass-lang.com), a CSS extension language, is used to write more sensible styles. In order to enable the transformation of Pug templates and SASS, a web application bundler called [Parcel](https://parceljs.org/getting_started.html) is used.

### URI Format

Any URL deeper than root ([bookmarkl.ink](https://bookmarkl.ink)) is interpreted as a bookmarklet. Each bookmarklet URI references exactly one GitHub gist that supplies the source code of the bookmarklet. The URI should adhere to the format `bookmarkl.ink/AUTHOR/ID/[VERSION]/[FILE]`.

Property | Required | Description
-------- | -------- | ---
Author   | Yes      | The username of the GitHub user that created a JavaScript gist.
ID       | Yes      | A gist ID. This must be a 32-character hexadecimal string.
Version  | No       | An optional version that represents the commit hash of the git repository underlying a GitHub gist. This must be a 40-character hexadecimal string.
File     | No       | An optional file name within a multi-file GitHub gist. If this property is omitted, the first file added to the gist will be used.

These properties, if provided, will be displayed as metadata belonging to the bookmarklet.

### Bookmarklet Metadata

In addition to the properties that define the GitHub gist from which to pull a bookmarklet's source code (see above), users can define several properties in a gist itself. These additional properties are optional.

So as not to alter the function of a bookmarklet, additional properties are defined in JavaScript comments using the format `[KEY]: [VALUE]` where `[VALUE]` is the value of the property and `[KEY]` is a key from the following table.

Property    | Key                 | Description
----------- | ------------------- | ---
Title       | `bookmarklet-title` | The title of the bookmarklet. This will be the default bookmark name that the browser assigns when the bookmarklet is saved.
Description | `bookmarklet-about` | This field can be used to explain the purpose or function of the bookmarklet.

### JavaScript to Bookmarklet

Theoretically, any valid JavaScript snippet should be able to run in a browser window. There are several steps, however, that must be performed to ensure snippets are able to be saved as bookmarklets.

Bookmarklets are saved in the same way as standard bookmarks. That means that when clicked, the bookmark(let) address is inserted into the URL bar and evaluated. In the case of a standard bookmark, this results in the browser navigating to the saved HTTP address. Bookmarklets rely on the fact that browsers evaluate addresses prepended with `javascript:` differently. Instead of navigating to an address, the JavaScript is executed on the current window.

Before transpilation and minification, dependencies are bundled. See [Bundling](#bundling) for more details.

Because writers of JavaScript gists will often use features of JavaScript that are not supported by older browsers, a [transpilation](https://en.wikipedia.org/wiki/Source-to-source_compiler) step should occur. [esbuild](https://esbuild.github.io) is used to perform this transpilation. Additionally, in order to shorten the length of the source code stored in a bookmarklet, the code is minified.

In order to properly store the bookmarklet in a bookmark, the transpiled, minified, source code is [URI encoded](https://www.w3schools.com/tags/ref_urlencode.ASP).

Some browsers, namely Firefox, have limited support of bookmarklets due to security concerns. We can sidestep the limitations added by Firefox by wrapping the bookmarklet source code in an anonymous, self-executing function, sometimes called an [IIFE](https://developer.mozilla.org/en-US/docs/Glossary/IIFE).

Finally, the saved bookmarklet will take the following form.

```
javascript:(function () {
  ...
  Transpiled, minified, URI-encoded source code here
  ...
})();
```

### Bundling

To enable reuse of modules, bookmarkl.ink bundles dependencies using [esbuild](https://esbuild.github.io). This fetches dependencies, inlines them into the output JavaScript, and performs optimizations including dead code elimination.

Only [static imports](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) are bundled. [Dynamic imports](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) remain unchanged and can be used to import modules at runtime rather than during bundling.

The following content types are supported by default.

Type | Extension | Behaviour
--|--|--
JS | `.js`, `.mjs` | JavaScript content is inlined, bundled, and minified using esbuild's [JS loader](https://esbuild.github.io/content-types/#javascript).
TS | `.ts`, `.mts` | TypeScript content is inlined, bundled, and minified using esbuild's [TS loader](https://esbuild.github.io/content-types/#typescript).
JSX | `.jsx`, `.tsx` | JSX/TSX XML elements become JavaScript function calls using esbuild's [JSX loader](https://esbuild.github.io/content-types/#jsx).
JSON | `.json` | JSON content is parsed into a JavaScript object and inlined using esbuild's [JSON loader](https://esbuild.github.io/content-types/#json).
CSS | `.css` | CSS content is loaded, minified using esbuild's [CSS loader](https://esbuild.github.io/content-types/#css), and inlined as a JavaScript string using esbuild's [Text loader](https://esbuild.github.io/content-types/#text).
Image | `.png`, `.jpg`, `.jpeg`, `.gif`, `.svg` | Image data is loaded, encoded as Base64, and inlined as a data URL string using esbuild's [Data URL loader](https://esbuild.github.io/content-types/#data-url).
Text | `.html`, `.txt`, `.md`, `.xml`, `.yml`, `.dat` | Text file content is loaded and inlined as a JavaScript string using esbuild's [Text loader](https://esbuild.github.io/content-types/#text).
Binary | `.bin`, `.wasm` | Binary data is loaded, encoded as Base64, and decoded into a `Uint8Array` at runtime using esbuild's [Binary loader](https://esbuild.github.io/content-types/#binary).

The default loader can be overridden using the `loader` property of [import attributes](https://github.com/tc39/proposal-import-attributes) e.g. `import base64 from 'https://placehold.co/10x10.png' with { loader: 'base64' };`.

## Development

Clone and navigate to the repository by running `git clone git@github.com:ashtonmeuser/bookmarklet-platform.git && cd bookmarklet-platform` in your terminal.

### Test

Tests and test coverage metrics can be run using `npm test`. Tests and associated mocks are found in the `test` directory. Coverage artifacts will be located in the `coverage` directory.

### Build and Run

The application can be run in development mode using `npm run dev`. This enables hot reloading and hosts the application locally at [localhost:5000](http://localhost:5000). In development mode, changes to Pug templates will result in the application being recompiled.

In order to build the application for production, run `npm run build`. This creates all assets required for the static site in the `dist` directory. This also minifies generated JavaScript, HTML, and CSS assets.

### Deploy

Before deploying, the [AWS CLI](https://aws.amazon.com/cli/) must be installed and properly configured. Additionally, an S3 bucket must be configured to host a static website (see [docs](https://docs.aws.amazon.com/AmazonS3/latest/dev/WebsiteHosting.html)).

Deployment is as simple as pushing the generated static site files to S3 using `aws s3 sync dist s3://[YOUR_BUCKET]`, replacing `[YOUR_BUCKET]` with your S3 bucket's name.

If hosted behind a CloudFront distribution, an [invalidation](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Invalidation.html) may be required to see the changes immediately. Configuring a CloudFront distribution is beyond the scope of this document.

Further, a simple routing rule must be applied to catch all requests to bookmarklet URIs. For example, the following simple [AWS Lambda@Edge](https://aws.amazon.com/lambda/edge/) function can be used to map all HTML requests (besides root) to the bookmarklets page.

```js
export const handler = async (event, context, callback) => {
  const request = event?.Records?.[0]?.cf?.request;
  if (request?.uri === '/' || request?.uri === '') return callback(null, request);
  if (request?.headers?.accept?.[0]?.value?.includes('text/html')) request.uri = '/bookmarklet.html';
  callback(null, request);
};
```

## Forewarning

Bookmarklets can be used maliciously. Be aware of the function being performed by a bookmarklet before using or saving it. The author denies any responsibility for harm caused by a malicious bookmarklet.

Note that unless a specific version is linked to (see difference between [unversioned](https://bookmarkl.ink/ashtonmeuser/21427841853c9f2292c8f7d7af0079ea//count.js) and [versioned](https://bookmarkl.ink/ashtonmeuser/21427841853c9f2292c8f7d7af0079ea/42b76885db0d1ca517377207d90c23a85a030bf2/count.js)), the function of a bookmarklet may change unexpectedly.
