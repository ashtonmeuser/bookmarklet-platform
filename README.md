# Bookmarklet Platform

A platform for distributing bookmarklets. Observable in the wild [here](https://bookmarkl.ink).

### Usage

This site can be used to create and share simple pieces of executable JavaScript, like an [emoji generator](https://bookmarkl.ink/b/#ashtonmeuser/JKgvxK), a [word counter](https://bookmarkl.ink/b/#ashtonmeuser/vJEOBJ), or a [QR code creator](https://bookmarkl.ink/b/#ashtonmeuser/JxybRe).

These executable pieces of code will run when the button is clicked. They can be run on an arbitrary webpage by dragging the button to your bookmarks bar, thereby creating a bookmarklet. On mobile, long-press the button to copy the JavaScript, which can be pasted into the URL field of a new bookmark.

To generate your own custom bookmarklet, write some JavaScript on [CodePen](http://codepen.io/pen), copy the pen's url, paste it in the input field, and hit generate.

You can assign a title and description to your bookmarklet by including `//bookmarklet_title: <your title>` and `//bookmarklet_about: <your details>` in your code, respectively.

### Forewarning

Bookmarklets can be used maliciously (see [example](https://bookmarkl.ink/b/#ashtonmeuser/NAQrwr)). Be aware of the function being performed by a bookmarklet before using or saving it. The author denies any responsibility of harm caused by a malicious bookmarklet.

Also, because JavaScript snippets created and saved on CodePen are not immutable, the function of a bookmarklet can be altered at any point. This could be harmful if an innocent bookmarklet is shared, then modified by the creator, then used by others.
