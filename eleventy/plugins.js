/**
 * @typedef {import('markdown-it')} MarkdownIt
 **/

/**
 * Detects internal links at markdown parsing time and add attributes for
 * security and handle those on an external tab.
 *
 * @param {MarkdownIt} md
 */
export const markdownItExternalLinks = (md) => {
  // Hoist default open link renderer and override it.
  const defaultLinkRender =
    md.renderer.rules.link_open ||
    function (tokens, idx, options, _, self) {
      return self.renderToken(tokens, idx, options);
    };

  md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
    const updatedTokens = Array.from(tokens);
    const token = updatedTokens[idx];

    const hrefIndex = token.attrIndex('href');
    const href = token.attrs[hrefIndex][1];
    const isExternal =
      href.startsWith('http://') | href.startsWith('https://') ||
      href.startsWith('//');

    // Append external link attributes.
    if (isExternal) {
      token.attrPush(['target', '_blank']);
      token.attrPush(['rel', 'noopener noreferrer']);
    }

    // Pass token to default renderer.
    return defaultLinkRender(updatedTokens, idx, options, env, self);
  };
};
