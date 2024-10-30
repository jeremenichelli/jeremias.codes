// const xmlPlugin = require('eleventy-xml-plugin');

import syntaxHighlightPlugin from '@11ty/eleventy-plugin-syntaxhighlight';
import pluginRss from '@11ty/eleventy-plugin-rss';
import {
  script,
  style,
  codeSnippetLink,
  codepen,
  blockquote
} from './eleventy/shortcodes.js';
import {
  dateToISOString,
  markdownify,
  unmarkdownify,
  orphans
} from './eleventy/filters.js';
import { md } from './eleventy/libraries.js';
import { all, posts, latestPosts } from './eleventy/collections.js';
import { htmlmin } from './eleventy/transforms.js';

export default function eleventy(config) {
  /* SERVER CONFIG */
  config.setServerOptions({
    domDiff: false,
    port: 5173
  });
  config.addWatchTarget('src/assets/styles/*.css');
  config.addWatchTarget('src/assets/scripts/*.js');

  /* DATA */
  config.addGlobalData('buildTimestamp', () => {
    return new Date().toISOString();
  });

  /* LIQUID AND GLOBAL CONFIG */
  config.setQuietMode(true);
  config.addLayoutAlias('base', 'layouts/base.liquid');
  config.addLayoutAlias('post', 'layouts/post.liquid');

  /* PLUGINS */
  config.addPlugin(syntaxHighlightPlugin, { lineSeparator: '\n' });

  /* FILTERS */
  config.addFilter('date_to_iso', dateToISOString);
  config.addFilter('date_to_rfc822', pluginRss.dateToRfc822);
  config.addFilter('markdownify', markdownify);
  config.addFilter('unmarkdownify', unmarkdownify);
  config.addFilter('orphans', orphans);

  /* COLLECTIONS */
  config.addCollection('all', all);
  config.addCollection('posts', posts);
  config.addCollection('latestPosts', latestPosts);

  /* SHORT CODES */
  config.addShortcode('script', script);
  config.addShortcode('style', style);
  config.addShortcode('codeSnippetLink', codeSnippetLink);
  config.addShortcode('codepen', codepen);
  config.addShortcode('blockquote', blockquote);

  /* MARKDOWN */
  config.setLibrary('md', md);

  /* COPY */
  config.addPassthroughCopy({ 'src/assets/images/*': 'assets/images' });
  config.addPassthroughCopy({ 'src/assets/favicons/*': 'assets/favicons' });
  config.addPassthroughCopy({ 'src/assets/fonts/*.woff2': 'assets/fonts' });
  config.addPassthroughCopy({ 'src/public/*': '.' });

  /* HTML */
  config.addTransform('htmlmin', htmlmin);

  // Return base config.
  return {
    passthroughFileCopy: true,
    dir: {
      input: 'src',
      output: '_site'
    }
  };
}
