import markdownIt from 'markdown-it';
import markdownItAnchor from 'markdown-it-anchor';
import { markdownItExternalLinks } from './plugins.js';

const markdownItAnchorOptions = {
  level: [2, 3, 4],
  permalink: markdownItAnchor.permalink.linkInsideHeader({
    placement: 'before',
    class: 'post__heading',
    renderAttrs: () => ({ tabindex: '-1', 'aria-hidden': 'true' })
  })
};

const markdownItOptions = {
  html: true,
  breaks: true,
  linkify: true
};

export const md = markdownIt(markdownItOptions)
  .use(markdownItAnchor, markdownItAnchorOptions)
  .use(markdownItExternalLinks);
