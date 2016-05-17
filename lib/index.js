/* eslint-disable deku/no-unknown-property */

import {render, tree} from 'deku';
import element from 'magic-virtual-element';
import {save as saveSelection, restore as restoreSelection} from 'save-selection';
import morphdom from 'morphdom';
import setupHtmlToArticleJson from 'html-to-article-json';
import assert from 'assert';
import setupArticle from 'article-json-html-render';
import embeds from './embeds';
import setupEvents from './setup-events';

const Article = setupArticle({
  embeds: embeds,
  renderEmptyTextNodes: true
});

function parseEmbed (type) {
  return (elm) => {
    if (!elm || elm.getAttribute('type') !== type || !elm.__props__) {
      return;
    }

    return elm.__props__;
  };
}

const htmlToArticleJson = setupHtmlToArticleJson({
  customEmbedTypes: [{
    embedType: 'facebook',
    parse: parseEmbed('facebook')
  }, {
    embedType: 'instagram',
    parse: parseEmbed('instagram')
  }, {
    embedType: 'twitter',
    parse: parseEmbed('twitter')
  }]
});

export default {
  name: 'Wrapper',
  render: ({props: {onInput}}) => {
    const _onInput = ({delegateTarget}) => {
      saveSelection(delegateTarget);
      const newArticleJson = htmlToArticleJson(delegateTarget);
      onInput({ items: newArticleJson });
    };

    const events = setupEvents(_onInput);
    return (<div contenteditable='true' {...events}>
      <Article items={[]} />
    </div>);
  },
  shouldUpdate: ({props}, nextProps) => {
    return props.items !== nextProps.items;
  },
  afterRender: ({props: {items}}, elm) => {
    const oldArticleElm = elm.querySelector('article');
    const app = tree(<Article items={items.map(formatItems)} />);

    const tmpElm = document.createElement('div');
    render(app, tmpElm);
    const newArticleElm = tmpElm.querySelector('article');

    assert(oldArticleElm, 'oldArticleElm must exists');
    assert(newArticleElm, 'newArticleElm must exists');

    morphdom(oldArticleElm, newArticleElm, {
      onBeforeElUpdated: function (fromEl, toEl) {
        return fromEl.tagName.toLowerCase() !== 'iframe';
      }
    });
    restoreSelection(oldArticleElm);
  }
};

function formatItems (item) {
  if (item.type === 'embed') {
    item.figureProps = { contenteditable: 'false' };
  }
  return item;
}