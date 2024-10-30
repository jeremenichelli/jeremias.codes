import { isProduction } from '../scripts/utils.js';

import htmlMinifier from 'html-minifier-terser';

export const htmlmin = (content, outputPath) => {
  if (outputPath.endsWith('.html') && isProduction) {
    const minified = htmlMinifier.minify(content, {
      useShortDoctype: true,
      removeComments: true,
      collapseWhitespace: true
    });

    return minified;
  }

  return content;
};
