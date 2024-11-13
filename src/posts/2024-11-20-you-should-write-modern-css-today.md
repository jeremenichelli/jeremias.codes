---
title: You should use modern CSS, today
excerpt: After years of relying on preprocessors and tools to improve my workflow, I shifted from treating CSS as a compile target to using it as my main styling source. Here’s a look at what the future of CSS might hold and how you can start using it today.
---

Putting some constraints on my personal projects helps me experience upcoming technologies and learn new things. So, when I started building the next version of this site, I decided that this time **no preprocessors, just CSS**.

The two features I used the most in both LESS and SASS: variables and nesting. With both Custom Properties being widely available for a long time and CSS Nesting shipped to all modern browsers, it felt like a safe move.

But there were other features I went for too, like custom media, logical properties, layers, new text wrapping values, new color models and functions.

Let's go over each of these to take a look at how modern (and today) CSS looks like.

## Nesting

There's a high chance you used some styling tool or library already know what nesting is, so not gonna waste a lot of time explaining it.

It's good to mention two things. First, it's now just CSS, out-of-the-box. Second, it's not one-to-one nesting you know. It has specificity implications and some things you might have used, like string interpolation, are not possible. Be on the lookout for possible discrepancies while migrating.

{% featuredLink '//caniuse.com/css-nesting' 'Browser compatibility for CSS Nesting' %}

## Layers

Talking about specificity, something really missing in the language was a way to "reset" specificity so base styles and more custom dedicated ones didn't come with a lot of weird hacks.

Now, you define the sequence in which your styles should be considered to take precedence over others without worrying about import order or accidentally specificity bumps.

```css
@layer reset, theme, content;
```

Up in your file you define the desired order of relevance. Then you enclose your styles in the corresponding layers.

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

Sometimes I stare at this code, and can't believe it's valid and _predictable_ CSS code.

If you know how these features work, given any possible HTML combination and structure, you can easily nail how an element will look with this style rules.

{% featuredLink '//caniuse.com/css-cascade-layers' 'Browser compatibility for CSS Layers' %}

## Custom Properties

Similar to nesting, variables in CSS is something that has been around for some time and was present in tooling as a concept. Also, there are differences in implementations, in preprocessors normally they act as a constant, but here they can be inherited and modified, making them way more powerful in my opinion.

The previous code for this site was a mix between both. So I just migrated all the LESS variables to CSS ones, creating values and systems for typography scaling, spacing, sizing and color.

{% featuredLink '//caniuse.com/css-variables' 'Browser compatibility for Custom Properties' %}

## Custom media

One of the immediate limitations I encountered using purely CSS variables was using them in media queries. And for obvious reasons, you could easily trigger never ending resizing loops for example.

Values inside media queries should act as constants, which CSS variables aren't. What was definitely a feature on top of SASS or LESS variables is now a limitation.

Hopefully, there's spec in the working draft to cover this use case.

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

In combination with CSS Nesting, you can achieve consistency across your stylesheets while clearly signaling contextual changes for each element.

{% featuredLink '//www.w3.org/TR/mediaqueries-5/#custom-mq' 'Working draft for Custom Media' %}

## Logical properties

Projects supporting several languages required heavy overrides depending on the locale of the user to prevent the site from breaking while supporting the direction required for each language.

Think about a site that needs to support Hebrew, French and Japanese. You would need to craft a whole layout system for each of those.

The response to this issue is **logical properties**. They define _inline_ and _block_ axis, with a _start_ and _end_ which all change depending on the writing direction.

In latin and most occidental languages, **inline** is horizontal, **block** is vertical, **start** is left while **end** is right.

Here's an example with margin properties.

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

These new properties are contextual to the `dir` attribute in the root element of the page, keeping the layout behavior consistent across different writing modes.

A really handy outcome of this new form is the ability to define one axis without having to specify all four values, in `margin` you can apply `margin-block` or `margin-inline` as individual axis shorthands.

{% featuredLink '//caniuse.com/css-logical-props' 'Browser compatibility for Logical Properties' %}

## New text wrapping values

I really dislike orphan words in paragraphs and unbalanced headings. I've even created an [Eleventy filter](//github.com/jeremenichelli/eleventy-nbsp-filter) to deal with this in the past.

This time, I decided to use both `balance` and `pretty` new values for `text-wrap`, their support is varied and not total in modern browsers, but I consider it a progressively enhanced touch. If your current browser doesn't support it your experience doesn't downgrade, but looks slightly different.

I like to use `balance` for headings, as it tries to match the amount of characters per line, and `pretty` for quotes and excerpts, this one doesn't alter each line but tries to optimize the last ones to avoid orphans.

I still use a simpler filter to deal with orphans in articles' excerpts.

{% featuredLink '//developer.mozilla.org/en-US/docs/Web/CSS/text-wrap' 'MDN documentation for text-wrap' %}

## Color models

For this rewrite, I went full on **hsl** color model. CSS has recently added several different ways to define a color value, but having the ability to choose **hue**, then its **saturation** and later **lightness** to me is the best mental model from a developer perspective.

Either you are using another modern one like **hwb** or are still in **rgb** color models, you are just sending parameters to obtain a certain color. Having the ability to set how saturated and bright I want that specific color is priceless.

If you are not familiar with **hue** imaging a circle with all the spectrum of colors, this value is your position inside that wheel. If you want _red_ you go with `0` , `120` for _green_, and around `240` you get some sort of _blurple_. In between you have all the rest of the spectrum.

For example, this would be your basic red color.

```css
color: hsl(0, 100%, 50%);
```

Do you want a pastel pink? Lower a bit of saturation and set a higher brightness.

```css
color: hsl(0, 70%, 85%);
```

A purple on the same pastel tone? Move the hue around that color position.

```css
color: hsl(240, 70%, 85%);
```

Building different colors themes as this page has, coming up with other syntax highlighting for `code` blocks and fixing accessibility contrast colors by slightly tweaking this manually was really priceless while building this site.

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

But things get more complicated if the system preference is set to dark, but the user wants the light theme locked.

You now need JavaScript to determine what the user selected, what's system preference, infer what the resulting theme is, use specific selectors for each mode to change variables and listen to system preference changes to manually toggle modes.

Suddenly, the complexity of supporting themes skyrockets.

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

It's true you still need JavaScript, but instead of scripting a full decision tree you just use it to modify the dataset value of the root element.

## What about backwards support in browsers?

## Wrap-up

<!-- Constraints like this means you potentially deal with the missing utilities and, more on the brightside, you are surprised with how much something has improved. -->


https://web.dev/articles/building/a-theme-switch-component