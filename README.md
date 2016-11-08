# Bookmarklet Platform
[![Build Status](https://travis-ci.org/ashtonmeuser/bookmarklet-platform.svg?branch=master)](https://travis-ci.org/ashtonmeuser/bookmarklet-platform)

A platform for distributing bookmarklets. Observable in the wild [here](http://bookmarklet-platform.herokuapp.com).

### Usage

The Bookmarklet Bazaar can be used to create and share simple pieces of executable Javascript, like [this](http://bookmarklet-platform.herokuapp.com/ashtonmeuser/JKgvxK), or [this](http://bookmarklet-platform.herokuapp.com/ashtonmeuser/NAQrwr).

To generate your own custom bookmarklet, write some Javascript on [CodePen](http://codepen.io/pen), copy the pen's url, paste it in the input field, and hit generate.

You can assign a title and description to your bookmarklet by including `//bookmarklet_title: <your title>` and `//bookmarklet_about: <your details>` in your code, respectively.

### Forewarning

Bookmarklets can be used maliciously (see [example](http://bookmarklet-platform.herokuapp.com/ashtonmeuser/NAQrwr)). Be aware of the function being performed by a bookmarklet before using or saving it. The author denies any responsibility of harm caused by a malicious bookmarklet.

Also, because Javascript snippets created and saved on CodePen are not immutable, the function of a bookmarklet can be altered at any point. This could be harmful if an innocent bookmarklet is shared, then modified by the creator, then used by others.
