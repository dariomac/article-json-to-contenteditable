import _test from 'tape-catch';
import FacebookEmbed from '../lib/embeds/facebook';
import InstagramEmbed from '../lib/embeds/instagram';
import TwitterEmbed from '../lib/embeds/twitter';
import loadEmbed from '../lib/embeds/load-embed';
import {render, renderString, tree} from 'deku';
import element from 'magic-virtual-element';

const fs = require('fs');
const fixtures = {
  facebookPost:
    fs.readFileSync(`${__dirname}/fixtures/facebook-post.html`, 'utf8').trim(),
  instagramPost:
    fs.readFileSync(`${__dirname}/fixtures/instagram-post.html`, 'utf8').trim(),
  twitterPost:
    fs.readFileSync(`${__dirname}/fixtures/twitter-post.html`, 'utf8').trim()
};

const test = process.browser ? _test : function () {};

test('FacebookEmbed - body', t => {
  const actual = renderString(tree(<FacebookEmbed embedAs='post' />));
  const expected = renderString(tree(
    <iframe type='facebook' frameBorder='0' width='100%' src='javascript:false'></iframe>));
  t.equal(actual, expected);
  t.end();
});

test('FacebookEmbed - onLoaded', t => {
  const opts = {
    url: 'https://www.facebook.com/david.bjorklund/posts/10153809692501070',
    embedAs: 'post',
    date: 'Thursday, January 21, 2016',
    user: 'David Pop Hipsterson',
    text: [{
      content: 'Hey!So, for the last few weeks I\'ve worked on http://mic.com/ - the new home for mic.com (on desktop) - please take a look :)',
      href: null
    }]
  };
  const el = document.body.appendChild(document.createElement('div'));
  const expectedPost = fixtures.facebookPost;
  const onLoaded = () => {
    const iframeBody = el.querySelector('iframe').contentWindow.document.body;
    const actualPost = iframeBody.innerHTML.slice(0, expectedPost.length);

    t.equal(actualPost, expectedPost);
    t.end();
  };
  render(tree(<FacebookEmbed {...opts} onLoaded={onLoaded} />), el);
});

test('FacebookEmbed onResize', t => {
  const opts = {
    url: 'https://www.facebook.com/david.bjorklund/posts/10153809692501070',
    embedAs: 'post',
    date: 'Thursday, January 21, 2016',
    user: 'David Pop Hipsterson',
    text: [{
      content: 'Hey!So, for the last few weeks I\'ve worked on http://mic.com/ - the new home for mic.com (on desktop) - please take a look :)',
      href: null
    }]
  };

  const el = document.body.appendChild(document.createElement('div'));
  const expectedHeight = 150;
  const onResize = ({height}) => {
    t.equal(height, expectedHeight);
    t.end();
  };
  render(tree(<FacebookEmbed {...opts} onResize={onResize} />), el);
});

test('InstagramEmbed - body', t => {
  const actual = renderString(tree(<InstagramEmbed />));
  const expected = renderString(tree(
    <iframe type='instagram' frameBorder='0' width='100%' src='javascript:false'></iframe>));
  t.equal(actual, expected);
  t.end();
});

test('InstagramEmbed - onLoaded', t => {
  const opts = {
    'caption': [],
    'date': {},
    'user': {},
    'id': 'tsxp1hhQTG',
    'text': '',
    'url': 'https://instagram.com/p/tsxp1hhQTG'
  };

  const el = document.body.appendChild(document.createElement('div'));
  const expectedPost = fixtures.instagramPost;
  const onLoaded = () => {
    const iframeBody = el.querySelector('iframe').contentWindow.document.body;
    const actualPost = iframeBody.innerHTML;

    t.equal(actualPost, expectedPost);
    t.end();
  };
  render(tree(<InstagramEmbed {...opts} onLoaded={onLoaded} />), el);
});

test('InstagramEmbed - onResize', t => {
  const opts = {
    'caption': [],
    'date': {},
    'user': {},
    'id': 'tsxp1hhQTG',
    'text': '',
    'url': 'https://instagram.com/p/tsxp1hhQTG'
  };

  const el = document.body.appendChild(document.createElement('div'));
  const expectedHeight = 754;
  const onResize = ({height}) => {
    t.equal(height, expectedHeight);
    t.end();
  };
  render(tree(<InstagramEmbed {...opts} onResize={onResize} />), el);
});

test('TwitterEmbed - body', t => {
  const actual = renderString(tree(<TwitterEmbed />));
  const expected = renderString(tree(
    <iframe type='twitter' frameBorder='0' width='100%' src='javascript:false'></iframe>));
  t.equal(actual, expected);
  t.end();
});

test('TwitterEmbed - onLoaded', t => {
  const opts = {
    'caption': [],
    'url': 'https://twitter.com/nvidia/status/699645794903666688',
    'date': '',
    'user': {
      'name': null,
      'slug': null
    },
    'id': '699645794903666688',
    'text': [{
      'content': 'Explore the power of mobility, flexibility, and collaboration at #GTC16. Learn more: http://nvda.ly/Y65h9 pic.twitter.com/cZ34wHVJaP',
      'href': null
    }]
  };

  const el = document.body.appendChild(document.createElement('div'));
  const expectedPost = fixtures.twitterPost;
  const onLoaded = () => {
    const iframeBody = el.querySelector('iframe').contentWindow.document.body;
    const actualPost = iframeBody.innerHTML;

    t.equal(actualPost, expectedPost);
    t.end();
  };
  render(tree(<TwitterEmbed {...opts} onLoaded={onLoaded} />), el);
});

test('TwitterEmbed - onResize', t => {
  const opts = {
    'caption': [],
    'url': 'https://twitter.com/ceejbot/status/712997641299210240',
    'date': '',
    'user': {
      'name': null,
      'slug': null
    },
    'id': '712997641299210240',
    'text': [{
      'content': 'tl;dr life is short; don’t reinvent stuff if you don’t have to; get on with YOUR interesting problem',
      'href': null
    }]
  };

  const el = document.body.appendChild(document.createElement('div'));
  const expectedHeight = 315;
  const onResize = ({height}) => {
    t.equal(height, expectedHeight);
    t.end();
  };
  render(tree(<TwitterEmbed {...opts} onResize={onResize} />), el);
});

test('loadEmbed()', t => {
  const iframe = document.body.appendChild(document.createElement('iframe'));
  iframe.src = 'javascript:false';
  const content = `<p>iframe content</p>
    <script>
      document.body.style.height = '200px';
      document.body.style.margin = '0';
      resize();
    </script>`;

  let onLoadedCalled = false;
  let onResizeCalled = false;
  function onLoaded () {
    onLoadedCalled = true;
  }
  function onResize ({height}) {
    onResizeCalled = true;
    const expectedHeight = 200;
    t.equals(height, expectedHeight);
  }

  loadEmbed({ iframe, content, onLoaded, onResize });

  t.ok(onLoadedCalled, 'onLoadedCalled');
  t.ok(onResizeCalled, 'onResizeCalled');
  t.equals(content, iframe.contentWindow.document.body.innerHTML);
  t.end();
});