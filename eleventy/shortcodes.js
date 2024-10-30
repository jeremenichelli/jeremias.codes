import bundle from '../scripts/bundle.js';
import styles from '../scripts/styles.js';

/**
 * Given a file name from the src/assets directory, injects a script tag with
 * the source and attributes, of inline code by passing the "inline" option.
 *
 * @param {string} file name of the file
 * @param  {string[]} options set of options
 * @returns {string} script tag with source and attributes or inline code to place in template
 */
export async function script(file, ...options) {
  const buildTimestamp = this.ctx.environments.buildTimestamp;
  const inline = options.some((option) => option === 'inline');
  const attributes = options.filter((option) => option !== 'inline').join(' ');
  const bundlePromise = bundle(file, inline, buildTimestamp);

  const result = await bundlePromise;

  const script = inline
    ? `<script ${attributes}>${result}</script>`
    : `<script src="${result}" ${attributes}></script>`;

  return script;
}

/**
 *
 * @returns {string} style tag contianing all CSS rules
 */
export async function style(file) {
  const buildTimestamp = this.ctx.environments.buildTimestamp;
  const css = await styles(file, buildTimestamp);

  return `<style>${css}</style>`;
}

/**
 * Shortcode to render a custom blockquote.
 *
 * @param {string} quote
 * @param {string} [cite]
 * @returns {string} returns blockquote/cite HTML structure.
 */
export const blockquote = (quote, cite) => {
  return `<blockquote><p class="card__quote">${quote}</p>${cite ? `<cite class="card__tag-line">${cite}</cite>` : ''}</blockquote>`;
};

/**
 * Shortcode to render a snippet link.
 *
 * @param {string} link
 * @returns {string} returns a string template containing the code snippet's link.
 */
export const codeSnippetLink = (link) => {
  return `<p class="code-snippet-link"><a href=${link} rel="noopener noreferrer" target="_blank">See this example in action</a></p>`;
};

/**
 * Shortcode to render a Codepen editor iframe.
 *
 * @param {string} hash
 * @returns {string} returns a string template containing the code snippet's link.
 */
export const codepen = (hash) => {
  return `<div data-height="300" data-theme-id="1" data-slug-hash="${hash}" data-default-tab="html,result" data-user="jeremenichelli" data-embed-version="2" class="codepen">
      ${codeSnippetLink(`https://codepen.io/jeremenichelli/pen/${hash}/`)}
    </div><script defer src="https://static.codepen.io/assets/embed/ei.js"></script>`;
};
