---
title: The markdown filters your Eleventy project needs
excerpt: Migrating from my old Jekyll site to Eleventy meant two things, I lost a lot of out-of-the-box helpers, but at the same time gained the flexibility to extend any part of my site build pipeline via JavaScript.
excerpt_2: While building one of these missing parts I used and no longer had, I realized I also needed its counterpart.
---

It is clear Eleventy is heavily inspired by Jekyll, the static generator I used for the longest time. It came with markdown and Liquid, an amazing combination.

But it was also slow and hard to extend unless you knew Ruby, which I didn't.

So, when Eleventy came out I became an early adopter, but porting revealed it was lacking some features. This wasn't as painful as expected because Eleventy was basically just JavaScript, which gave me a new power I didn't have before. I can shape how my site gets built in almost every way.

The first filter I had to build was `markdownify`, which comes by default with Jekyll.

Not a super complex one. You install `markdown-it`, create a new instance of it to make use of the `renderInline` method.

```js
import markdownIt from 'markdown-it';
const md = markdownIt();

export const markdownify = (content) => md.renderInline(content);
```

The next step is to add the filter to your Eleventy configuration file.

```js
import { markdownify } from './eleventy/filters.js';

export default function eleventy(config) {
  config.addFilter('markdownify', markdownify);
}
```

This filter is really handy because it allows you to use markdown with your front matter content or data you might fetch.

```liquid
{% raw %}{{ page.excerpt | markdownify }}{% endraw %}
```

Eleventy allows you to override and configure the markdown engine, so make sure they match to prevent inconsistencies. In my case, I am already providing my own instance so I make use of it for both filters and content.

## The thing I realized after more than a decade of using this filter

Funny enough, I was recently inspecting the build output and realized, well, I had markdown syntax in places that didn't make any sense.

So, if you have this filter, you might also need a kind of reversed one to extract only text nodes from markdown syntax data.

I present to you the `unmarkdownify` filter.

```js
import markdownIt from 'markdown-it';
const md = markdownIt();

export const unmarkdownify = (content) => {
  return md
    .parseInline(content)[0]
    .children.filter(
      (token) => token.type === 'text' || token.type === 'code_inline'
    )
    .map((token) => token.content)
    .join('');
};
```

A bit more complex than the previous one. I am still unsure if I am missing any edge case, but so far this has been working for me.

We use the `parseInline` method which doesn't render to string, but breaks down the syntax into tokens, then we filter only text and inline code tags to extract their content and join all of them in a string.

In places where you just need the text content from this data you do the following.

```liquid
<meta name="description" content="{% raw %}{{ page.excerpt | unmarkdownify }}{% endraw %}">
```

Of course, remember to add this filter to your config too.

## Wrap-up

Moral of the story, please, inspect closely your build output.
