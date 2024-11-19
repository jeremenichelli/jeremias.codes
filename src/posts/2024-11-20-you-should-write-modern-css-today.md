---
title: You should write modern CSS, today
excerpt: After years of relying on preprocessors and tools to improve my workflow, I shifted from treating CSS as a compile target to using it barebone. Here’s a look at what the future, and present, of the language looks like and how you can start using it today.
---

Putting some constraints on my personal projects helps me experience upcoming technologies and learn new things. So, when I started building the next version of this site, I decided that this time **no preprocessors, just CSS**.

The two features I use the most in both LESS and SASS are variables and nesting, but with both Custom Properties and CSS Nesting shipped to all modern browsers, it felt like it was time to give plain CSS a try.

To my surprise, there were other interesting features I could tap into, like custom media, logical properties, layers, modern text wrapping styles, and new color models and functions among others.

Let's go over the ones I got to use recently and how they might shape how you write styles in the near future.

## Nesting

There's a high chance you used some styling tool or library already know what nesting is, so not gonna waste a lot of time explaining it.

```css
.dialog {
  display: none;

  &:is(.visible){
	display: block;
  }

  &:is(.full){
	width: 90vw;
  }
}
```

It's good to mention though there's not a lot of difference if you are coming from a preprocessed styling language, it's not one-to-one in capabilities. Some patterns like string interpolation are not possible.

Be on the lookout for possible discrepancies while migrating.

{% featuredLink '//caniuse.com/css-nesting' 'Browser compatibility for CSS Nesting' %}

## Layers

Dealing with specificity is one of the top complaints from developers, usually leading to strange hacks to properly indicate base style to more specific ones.

With layers, you define the sequence in which your styles should take precedence over others. without worrying about import or cascade order, or some specific modifiers increasing the specificity of a certain rule.

```css
@layer reset, theme, content;
```

Then you enclose your styles in the preferred layers.

```css
@layer reset {
  a {
	color: inherit;
	text-decoration: none;

	:hover {
  	text-decoration: underline;
	}
  }
}

@layer theme {
  a {
	[data-theme='accent'] & {
  	color: var(--accent);
	}
  }
}

@layer content {
  .featured-link {
	font-style: italic;
	text-decoration: underline;
  }
}
```

Given any possible HTML combination and structure around these selectors, you can easily nail how an element will look, making CSS highly deterministic and predictable.

{% featuredLink '//caniuse.com/css-cascade-layers' 'Browser compatibility for CSS Layers' %}

## Custom Properties

Similar to nesting, variables in CSS is something that has been around for some time and was present in tooling as a concept.

There are also differences in its native implementation, in preprocessors normally they act as constants, but CSS Properties can be inherited and modified at any step in the CSSOM tree, making them way more powerful in my opinion.

The previous code for this site was using a mix between both. So, I just migrated all the LESS variables to CSS ones, creating values and systems for typography scaling, spacing, sizing and color.

{% featuredLink '//caniuse.com/css-variables' 'Browser compatibility for Custom Properties' %}

## Custom media

One of the immediate limitations I encountered while moving all my values to CSS variables was using them in media queries. This was probably made by design as you could easily create loops and infinite cascades of variable recalculations.

Values inside media queries declarations need to act as constants, which CSS variables aren't, becoming a limitation while migrating from LESS in my case.

Hopefully, there's spec in the working draft stage to cover this use case.

```css
@custom-media --really-small-devices-that-might-not-exist (max-width: 320px);
@custom-media --big-devices (min-width: 640px);
@custom-media --not-big-devices (max-width: 639px);
```

By declaring this you have constant references to media states.

```css
.container {
  padding: var(--spacing--small);

  @media (--big-devices) {
	padding: var(--spacing--large);
  }
}
```

In combination with CSS Nesting, you can achieve consistency across your style rules while clearly signaling contextual changes for each of them.

{% featuredLink '//www.w3.org/TR/mediaqueries-5/#custom-mq' 'Working draft for Custom Media' %}

## Logical properties

Projects supporting several languages required tons of painful overrides for each possible locale and layout disposition you have in it.

Think about a site that needs to support Hebrew, French and Japanese. You would need to craft a whole set of rules for each of those.

The response to this issue is **logical properties**. They define inline and block axes, with a start and end, which all adapt to the writing direction.

In latin and most occidental languages, **inline** is horizontal, **block** is vertical, **start** is left while **end** is right.

Here's an example on how you would write margin using these properties.

```css
/* Before */
margin-top: 12px;

/* Now, with logical properties */
margin-block-start: 12px;

margin-left: 12px;
margin-inline-start: 12px;

margin-bottom: 12px;
margin-block-end: 12px;

margin-right: 12px;
margin-inline-end: 12px;
```

My site won't likely support other languages, but using them even in these cases is a good opportunity to train our brains in using them and understand how they work.

You can try modifying the `dir` attribute in the root element to `rtl` mode manually and see how the layout adapts with no overrides in place.

A really handy outcome of this new form is the ability to write rules for one orientation without having to specify all four values, in `margin` you can apply `margin-block` or `margin-inline` as individual axis shorthands.

{% featuredLink '//caniuse.com/css-logical-props' 'Browser compatibility for Logical Properties' %}

## New text wrapping values

I really dislike orphan words in paragraphs and unbalanced headings. I've even created [Eleventy filters](//github.com/jeremenichelli/eleventy-nbsp-filter) to deal with this in the past.

This time, I decided to use both `balance` and `pretty` new values for `text-wrap`.

Their support is varied and not fully present in modern browsers, but you can consider it a progressively enhanced touch. If your current browser doesn't support it your experience doesn't downgrade, but looks slightly different.

I like to use `balance` for headings, as it tries to match the amount of characters per line, and `pretty` for quotes and excerpts, this one doesn't alter each line but tries to optimize the last ones to avoid orphans.

I still use a simpler filter to deal with orphans in articles' excerpts as fallback.

{% featuredLink '//developer.mozilla.org/en-US/docs/Web/CSS/text-wrap' 'MDN documentation for text-wrap' %}

## Color models

For this version of my site, I went full on **hsl** color model.

CSS has recently added several different ways to define a color value, but having the ability to choose **hue**, then its **saturation** and later **lightness** to me is the best mental model from a reading perspective.

If you are not familiar with **hue**, imaging a circle with all the spectrum of colors, this value is your position inside that wheel. If you want _red_ you go with `0` , `120` for _green_, and around `240` you get some sort of _blurple_. In between you have all the rest of the spectrum.

For example, this would be your basic red color.

```css
color: hsl(0, 100%, 50%);
```

Do you want a pastel pink? Lower a bit of saturation and set a higher brightness.

```css
color: hsl(0, 70%, 85%);
```

A purple on the same pastel tone? Move the hue to that color position.

```css
color: hsl(240, 70%, 85%);
```

Building different colors themes as this page has, coming up with other syntax highlighting for `code` blocks and fixing accessibility contrast colors by slightly tweaking these parameters was really priceless on this iteration.

{% featuredLink '//caniuse.com/css3-colors' 'Browser compatibility for CSS3 Colors' %}

## The light-dark function

Talking about theming, dark mode is quite a popular thing now in both personal blogs and web applications.

_You can access the theme menu of this site by clicking the circle at the top-right corner of the page. You can choose between system, light, dark and other hues._

Providing a _system_ option that consumes the device setting seems pretty straight-forward, you declare the schemes you want to support and override the variables under the color scheme media query.

```css
:root {
  color-scheme: light dark;

  --background: #fefefe;
  --text: #010101;
}

@media (prefers-color-scheme: dark) {
  :root {
	--background: #010101;
	--text: #fefefe;
  }
}
```

But things get more complicated when you want to provide a system mode and a way for the user to lock either the light or dark theme.

You now need JavaScript to determine what the user selected, what's system preference, infer what the resulting theme is, use specific selectors for each mode to change variables and listen to system preference changes to manually toggle modes.

Suddenly, the complexity of theming escalates, by a lot.

Another really annoying thing is having a big collection of CSS variables which becomes hard to maintain as the list grows.

The new `light-dark` method in CSS solves both of these inconveniences.

First, you declare values for both color schemes just once.

```css
:root {
  color-scheme: light dark;

  --background: light-dark(#fefefe, #010101);
  --text: light-dark(#010101, #fefefe);
}
```

And finally, you don't need a whole decision tree to determine the theme. If a user selects a specific scheme you can indicate that via CSS too.

```css
:root[data-theme='light'] {
  color-scheme: light;
}

:root[data-theme='dark'] {
  color-scheme: dark;
}
```

And that's it.

It's true you still need JavaScript, but instead of writing a full decision tree you just use it to modify a dataset value or a class on the root element.

## What about backwards support in browsers?

All these features are amazing, but it's true some of them are just arriving to browsers, and even some like custom queries are still in draft.

You might be wondering how this site is using all of these. The answer is [lightningcss](//lightningcss.dev), brought by the folks behind Parcel bundler. It not only transforms all these newer syntax into backwards compatible CSS, but also is a great minifier.

This tool is written efficiently in Rust, so is blazing fast, and there's a high chance it can be integrated to your current tool pipeline.

## Wrap-up

Constraints like the one I set at the beginning of this rewrite mean you potentially have to deal with some downgrades, but also be surprised with how much something has improved.

And I am delighted with how powerful today and future CSS has gotten.

The language is really attacking several fronts, not only you need to write less code to achieve the same things, it's improving developer experience, making code more readable and scalable, and making specificity way less of a burden to deal with.

### Further reading

- [Using CSS Nesting](//developer.mozilla.org/en-US/docs/Web/CSS/CSS_nesting/Using_CSS_nesting) on MDN.
- [Cascade Layers Guide](//css-tricks.com/css-cascade-layers/) by Miriam Suzanne on CSS Tricks.
 - [Using CSS custom properties](//developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) on MDN.
 - [Can we have custom media queries, please?](https://www.stefanjudis.com/notes/can-we-have-custom-media-queries-please/) by Stefan Judis.
 - [Logical properties](//web.dev/learn/css/logical-properties) on web.dev.
 - [Future CSS: Text Wrap Pretty](//alexpate.com/posts/future-css-text-wrap-pretty) by Alex Pate.
 - [A Guide To Modern CSS Colors With RGB, HSL, HWB, LAB And LCH](https://www.smashingmagazine.com/2021/11/guide-modern-css-colors/) by Michelle Barker on Smashing Magazine.
 - [CSS color-scheme-dependent colors with light-dark()](//web.dev/articles/light-dark) by Bramus on web.dev.
 - [A theme switch component](//web.dev/articles/building/a-theme-switch-component) on web.dev blog.
