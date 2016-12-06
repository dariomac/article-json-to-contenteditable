import _test from 'tape-catch';
import pretty from 'pretty';
import element from 'magic-virtual-element';
import { render, tree } from 'deku';
import setupArticle from 'article-json-html-render';
import patchDom from '../lib/patch-dom';
import embeds from '../lib/embeds';

const test = process.browser ? _test : function () {};
const Article = setupArticle({
  embeds,
  renderEmptyTextNodes: true
});

const renderArticle = (items) => {
  const container = document.createElement('div');
  render(tree(<Article items={items} />), container);
  return container.querySelector('article');
};

test('patchDom() edit paragraph', t => {
  const oldItems = [{
    type: 'paragraph',
    children: [{
      type: 'text',
      content: 'beep'
    }]
  }];
  const newItems = [{
    type: 'paragraph',
    children: [{
      type: 'text',
      content: 'beep boop'
    }]
  }];
  const oldArticleElm = renderArticle(oldItems);
  const newArticleElm = renderArticle(newItems);
  patchDom({oldArticleElm, newArticleElm});

  t.is(pretty(oldArticleElm.innerHTML), pretty('<p>beep boop</p>'));
  t.end();
});

test('patchDom() remove paragraph', t => {
  const oldItems = [{
    type: 'paragraph',
    children: [{
      type: 'text',
      content: 'beep'
    }]
  }, {
    type: 'paragraph',
    children: [{
      type: 'text',
      content: 'boop'
    }]
  }];
  const newItems = [{
    type: 'paragraph',
    children: [{
      type: 'text',
      content: 'boop'
    }]
  }];
  const oldArticleElm = renderArticle(oldItems);
  const newArticleElm = renderArticle(newItems);
  patchDom({oldArticleElm, newArticleElm});

  t.is(pretty(oldArticleElm.innerHTML), pretty('<p>boop</p>'));
  t.end();
});

test('patchDom() insert paragraph', t => {
  const oldItems = [{
    type: 'paragraph',
    children: [{
      type: 'text',
      content: 'beep'
    }]
  }, {
    type: 'paragraph',
    children: [{
      type: 'text',
      content: 'boop'
    }]
  }];
  const newItems = [{
    type: 'paragraph',
    children: [{
      type: 'text',
      content: 'beep'
    }]
  }, {
    type: 'paragraph',
    children: [{
      type: 'text',
      content: 'foo'
    }]
  }, {
    type: 'paragraph',
    children: [{
      type: 'text',
      content: 'boop'
    }]
  }];
  const oldArticleElm = renderArticle(oldItems);
  const newArticleElm = renderArticle(newItems);
  patchDom({oldArticleElm, newArticleElm});

  t.is(pretty(oldArticleElm.innerHTML), pretty('<p>beep</p><p>foo</p><p>boop</p>'));
  t.end();
});

test('patchDom() add embed', t => {
  const oldItems = [{
    type: 'embed',
    embedType: 'facebook',
    url: 'https://www.facebook.com/david.bjorklund/posts/10153809692501070'
  }];
  const newItems = [{
    type: 'embed',
    embedType: 'facebook',
    url: 'https://www.facebook.com/david.bjorklund/posts/10153809692501070'
  }, {
    type: 'embed',
    embedType: 'instagram',
    id: 'tsxp1hhQTG',
    url: 'https://instagram.com/p/tsxp1hhQTG'
  }];
  const oldArticleElm = renderArticle(oldItems);
  const newArticleElm = renderArticle(newItems);
  patchDom({oldArticleElm, newArticleElm});

  t.is(pretty(oldArticleElm.innerHTML), pretty(
    `<figure>
      <iframe id="facebook-davidbjorklundposts10153809692501070" type="facebook"
        frameborder="0" width="100%" src="javascript:false"></iframe>
    </figure>
    <figure>
      <iframe id="instagram-tsxp1hhQTG" type="instagram" frameborder="0"
      width="100%" src="javascript:false"></iframe>
    </figure>`
  ));
  t.end();
});

test('patchDom() insert paragraph between embeds', t => {
  const oldItems = [{
    type: 'embed',
    embedType: 'facebook',
    url: 'https://www.facebook.com/david.bjorklund/posts/10153809692501070'
  }, {
    type: 'embed',
    embedType: 'instagram',
    id: 'tsxp1hhQTG',
    url: 'https://instagram.com/p/tsxp1hhQTG'
  }];
  const newItems = [{
    type: 'embed',
    embedType: 'facebook',
    url: 'https://www.facebook.com/david.bjorklund/posts/10153809692501070'
  }, {
    type: 'paragraph',
    children: [{
      type: 'text',
      content: 'beep boop'
    }]
  }, {
    type: 'embed',
    embedType: 'instagram',
    id: 'tsxp1hhQTG',
    url: 'https://instagram.com/p/tsxp1hhQTG'
  }];
  const oldArticleElm = renderArticle(oldItems);
  const newArticleElm = renderArticle(newItems);
  patchDom({oldArticleElm, newArticleElm});

  t.is(pretty(oldArticleElm.innerHTML), pretty(
    `<figure>
      <iframe id="facebook-davidbjorklundposts10153809692501070" type="facebook"
      frameborder="0" width="100%" src="javascript:false"></iframe>
    </figure>
    <p>beep boop</p>
    <figure>
      <iframe id="instagram-tsxp1hhQTG" type="instagram" frameborder="0"
        width="100%" src="javascript:false"></iframe>
    </figure>`
  ));
  t.end();
});

test('patchDom() move paragraph', t => {
  const oldItems = [{
    type: 'paragraph',
    children: [{
      type: 'text',
      content: 'beep'
    }]
  }, {
    type: 'paragraph',
    children: [{
      type: 'text',
      content: 'boop'
    }]
  }, {
    type: 'paragraph',
    children: [{
      type: 'text',
      content: 'baap'
    }]
  }];
  const newItems = [{
    type: 'paragraph',
    children: [{
      type: 'text',
      content: 'boop'
    }]
  }, {
    type: 'paragraph',
    children: [{
      type: 'text',
      content: 'beep'
    }]
  }, {
    type: 'paragraph',
    children: [{
      type: 'text',
      content: 'baap'
    }]
  }];
  const oldArticleElm = renderArticle(oldItems);
  const newArticleElm = renderArticle(newItems);
  patchDom({oldArticleElm, newArticleElm});

  t.is(pretty(oldArticleElm.innerHTML), pretty('<p>boop</p><p>beep</p><p>baap</p>'));
  t.end();
});

test('patchDom() move embed', t => {
  const oldItems = [{
    type: 'embed',
    embedType: 'instagram',
    id: 'tsxp1hhQTG',
    url: 'https://instagram.com/p/tsxp1hhQTG'
  }, {
    type: 'embed',
    embedType: 'facebook',
    url: 'https://www.facebook.com/david.bjorklund/posts/10153809692501070'
  }];
  const newItems = [{
    type: 'embed',
    embedType: 'facebook',
    url: 'https://www.facebook.com/david.bjorklund/posts/10153809692501070'
  }, {
    type: 'embed',
    embedType: 'instagram',
    id: 'tsxp1hhQTG',
    url: 'https://instagram.com/p/tsxp1hhQTG'
  }];
  const oldArticleElm = renderArticle(oldItems);
  const newArticleElm = renderArticle(newItems);
  patchDom({oldArticleElm, newArticleElm});

  t.is(pretty(oldArticleElm.innerHTML), pretty(
    `<figure>
      <iframe id="facebook-davidbjorklundposts10153809692501070" type="facebook"
      frameborder="0" width="100%" src="javascript:false"></iframe>
    </figure>
    <figure>
      <iframe id="instagram-tsxp1hhQTG" type="instagram" frameborder="0"
      width="100%" src="javascript:false"></iframe>
    </figure>`
  ));
  t.end();
});
