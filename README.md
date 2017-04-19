# article-json-to-contenteditable

## Installation

Download node at [nodejs.org](http://nodejs.org) and install it, if you haven't already.

```sh
npm install article-json-to-contenteditable --save
```
## Example
```js
import React, { Component } from 'react';
import { render } from 'react-dom';

import setupArticle from '../lib';

const Article = setupArticle();

class App extends Component {
  constructor() {
    super();

    this.state = {
      items: [
        {
          type: 'paragraph',
          children: [{
            type: 'text',
            content: 'Text text text',
            href: null,
            italic: false,
            bold: false,
            mark: false,
            markClass: null
          }]
        }, {
          type: 'embed',
          embedType: 'facebook',
          url: 'https://www.facebook.com/david.bjorklund/posts/10153809692501070',
          embedAs: 'post',
          date: 'Thursday, January 21, 2016',
          user: 'David Pop Hipsterson',
          text: [{
            content: 'Hey! So, for the last few weeks I\'ve worked on http://mic.com/ - the new home for mic.com (on desktop) - please take a look :)',
            href: null
          }]
        }
      ]
    }

    this.onUpdate = this.onUpdate.bind(this);
    this.getCustomKeyDown = this.getCustomKeyDown.bind(this);
  }

  onUpdate({items, selectionBoundingClientRect, activeItem}) {
    console.log('in client.js onUpdate');
    console.log('selectionBoundingClientRect:', selectionBoundingClientRect);
    console.log('activeItem:', activeItem);
    this.setState({ items });
  }

  getCustomKeyDown(e) {
    // Return method(s) to handle any keydown events you want custom
    // handling for, like undo/redo etc.
    const zKeyCode = 90;
    if (e.metaKey && e.keyCode === zKeyCode) {
      return function handleUndoRedo () {
        console.log('should undo/redo');
      };
    }
  }

  render() {
    return (<Article
      items={this.state.items}
      onUpdate={this.onUpdate}
      getCustomKeyDown={this.getCustomKeyDown}
    />);
  }
}

const container = document.querySelector('#editor');
render(<App />, container);

```

## Tests

```sh
npm install
npm test
```

## Dependencies

- [article-json-html-render](https://github.com/micnews/article-json-html-render): Base for html-based article-json renderer, such as [article-json-to-amp](https://www.npmjs.com/package/article-json-to-amp)
- [deku](https://github.com/dekujs/deku): Create view components using a virtual DOM
- [embeds](https://github.com/micnews/embeds): Parse &amp; render embeds
- [html-to-article-json](https://github.com/micnews/html-to-article-json): Converting HTML to article-json
- [keycode](https://github.com/timoxley/keycode): Convert between keyboard keycodes and keynames and vice versa.
- [magic-virtual-element](https://github.com/dekujs/magic-virtual-element): Build virtual tree elements with magic attributes
- [morphdom](https://github.com/patrick-steele-idem/morphdom): Morph a DOM tree to another DOM tree (no virtual DOM needed)
- [save-selection](https://github.com/micnews/save-selection): Save &amp; restore selections in a document, using `&lt;mark&gt;` elements

## Dev Dependencies

- [babel-cli](https://github.com/babel/babel/tree/master/packages): Babel command line.
- [babel-plugin-transform-react-jsx](https://github.com/babel/babel/tree/master/packages): Turn JSX into React function calls
- [babel-preset-es2015](https://github.com/babel/babel/tree/master/packages): Babel preset for all es2015 plugins.
- [babel-tape-runner](https://github.com/wavded/babel-tape-runner): Babel + Tape for running your ES Next tests
- [babelify](https://github.com/babel/babelify): Babel browserify transform
- [beefy](https://github.com/chrisdickinson/beefy): local development server that aims to make using browserify fast and fun
- [brfs](https://github.com/substack/brfs): browserify fs.readFileSync() static asset inliner
- [browserify](https://github.com/substack/node-browserify): browser-side require() the node way
- [create-event](https://github.com/kenany/create-event): Create an event object
- [electron-prebuilt](https://github.com/electron-userland/electron-prebuilt): Install electron prebuilt binaries for the command-line use using npm
- [faucet](https://github.com/substack/faucet): human-readable TAP summarizer
- [semistandard-deku](https://github.com/micnews/semistandard-deku): All the goodness of `feross/standard` with semicolons sprinkled on top. Adapted for deku
- [snazzy](https://github.com/feross/snazzy): Format JavaScript Standard Style as Stylish (i.e. snazzy) output
- [tape](https://github.com/substack/tape): tap-producing test harness for node and browsers
- [tape-catch](https://github.com/michaelrhodes/tape-catch): a wrapper around tape that catches and reports exceptions
- [testron](https://github.com/shama/testron): CI your client side tests with Electron


## License

MIT

_Generated by [package-json-to-readme](https://github.com/zeke/package-json-to-readme)_
