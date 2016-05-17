import element from 'magic-virtual-element';
import {render as renderEmbed} from 'embeds';
import {renderString, tree} from 'deku';
import loadEmbed from './load-embed';

export default {
  name: 'InstagramEmbed',
  render: () => {
    return <iframe type='instagram' frameBorder='0' width='100%' src='javascript:false'></iframe>;
  },
  afterMount: ({props}, iframe) => {
    iframe.__props__ = props;
    const {embedAs, url, text, user = {}, date = {}, onLoaded, onResize} = props;
    const content = renderString(tree(renderEmbed({ type: 'instagram', embedAs, url, text, user: user, date })));
    // Needed for tests to pass
    const protocol = window.location.protocol === 'file:'
      ? 'https:'
      : '';

    const script = `<script src="${protocol}//platform.instagram.com/en_US/embeds.js"></script>
      <script>resize()</script>`;

    loadEmbed({ content: content + script, iframe, onLoaded, onResize });
  }
};