# Bookmarklet Platform

A platform for distributing JavaScript gists as bookmarklets. Observable in the wild [here](https://bookmarkl.ink).

## Background

### Bookmarklets

According to [Wikipedia](https://en.wikipedia.org/wiki/Bookmarklet), bookmarklets are described as follows.

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

```
window.alert("Hello, World!");
```

Navigate to [bookmarkl.ink](https://bookmarkl.ink) and paste the gist URL into the input on the bottom of the page. Click the "Create" button. The resultant page is your generated bookmarklet. Clicking the button at the bottom of the page will run your bookmarklet's JavaScript source code. In many desktop web browsers, the bookmarklet can be saved by dragging the button to the browser's toolbar, typically just below the URL bar.

The URL can be shared to allow others to run and/or save your bookmarklet.

### Customizing a Bookmarklet

To add a title to the bookmarklet, include `// bookmarklet-title: [TITLE]` in your gist, replacing `[TITLE]` with your desired title. Similarly, a description for the bookmarklet can be added with `// bookmarklet-about: [ABOUT]`.

To link to a specific version of the GitHub gist source code, you'll first need to get the commit hash from GitHub. One way to accomplish this is to view the raw source of your gist using the "•••" button in GitHub. In the URL, you should find a commit hash of 40 hexadecimal characters. A bookmarklet can be locked to this version of the source code by modifying the bookmarklet URL to the format `bookmarkl.ink/[USERNAME]/[ID]/[COMMIT]`, replacing the `[USERNAME]`, `[ID]`, and `[COMMIT]` placeholders with your gist's values.

If you've created a multi-file gist, you can ensure your bookmarklet pulls its source code from a specific file by modifying the bookmarklet URL to the format `bookmarkl.ink/[USERNAME]/[ID]/[COMMIT]/[FILE]`, replacing the `[USERNAME]`, `[ID]`, and `[FILE]` placeholders with yours. To avoid locking to a specific version, the `[COMMIT]` property can be omitted (the two consecutive forward slashes should be kept).

## Design

### Technology Stack

Bookmarkl.ink is hosted as a [static site](https://en.wikipedia.org/wiki/Static_web_page) i.e. files are served unaltered to all viewers. The static site is hosted in an [AWS S3](https://aws.amazon.com/s3/) bucket. To enable caching, the bucket is behind an [AWS CloudFront](https://aws.amazon.com/cloudfront/) distribution.

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

Because writers of JavaScript gists will often use features of JavaScript that are not supported by older browsers, a [transpilation](https://en.wikipedia.org/wiki/Source-to-source_compiler) step should occur. [Babel](https://babeljs.io) is used to perform this transpilation. Additionally, in order to shorten the length of the source code stored in a bookmarklet, the code is minified by Babel.

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
