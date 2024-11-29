import { md } from './libraries.js';

/**
 * Eleventy filter to transform dates into valid ISO 8601 format.
 *
 * Useful for Open Graph meta tags.
 *
 * @param {string} date string with exact date
 * @returns {string} ISO 8601 valid date
 */
export const dateToISOString = (date) => {
  return new Date(date).toISOString();
};

/**
 * Eleventy filter to turn frontmatter content into markdown result.
 *
 * @param {string} content Take frontmatter data string and process it as Markdown content
 * @returns {string} Processed string via `markdown-it`
 */
export const markdownify = (content) => md.renderInline(content);

/**
 * Eleventy filter to grab a markdown content string and resolve to only text nodes.
 *
 * @param string content
 * @returns {string} Processed string without markdown tokens
 */
export const unmarkdownify = (content) => {
  return md
    .parseInline(content)[0]
    .children.filter(
      (token) => token.type === 'text' || token.type === 'code_inline'
    )
    .map((token) => token.content)
    .join('');
};

/**
 * This filter joins the last two words with the &nbsp; HTML entity to
 * prevent orphan words in paragraphs.
 *
 * @param {string} content
 * @returns {string} Resulting string.
 */
export const orphans = (content) => {
  const regex = / (?=[^ ]*$)/;

  // Replace the last space with another character, for example:
  return content.replace(regex, '&nbsp;');
};
