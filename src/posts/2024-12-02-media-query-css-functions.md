---
title: What if media queries were CSS functions
excerpt: While rebuilding this site I went all-in for newer CSS features. One of them was the light-dark function, which reduced the amount of code needed for theming by a lot. What would happen if other media queries were also functions?
---

Remember that time when all applications and sites suddenly implemented a dark mode? There are many implementions, binary switches with both options, and triple state controls adding the device configuration choice, and some even just implementing this system option.

The spec allowed us to tap into this last system option fairly easy.

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

body {
  color: var(--color);
  background-color: var(--background);
}
```

Small sites and maybe some side projects are fine with a small gorup of variables, things get messier when you are in a complex product though.

In design system and application I worked in the past, we had hundreds of color tokens making maintenance a real burden.

We, humans, struggle a lot with long lists, so you could easily miss the dark version of one of those tokens, misspelled one, or even forget to delete deprecated ones.

## The new light-dark function

We were not super used to having functions in CSS. We saw them first in new color models, and now it's becoming a pretty common pattern after CSS variables and other features got accepted.

For light-dark, this newer syntax allows you to define first the color under the light scheme and later the dark one.

```css
:root {
  color-scheme: light dark;

  --background: light-dark(#fefefe, #010101);
  --text: light-dark(#010101, #fefefe);
}
```

If you have a big collection of variables, this literally halves the amount of lines you need, plus the media query syntax wrapping.

Though it is already present in all modern browsers, their inclusion was recent and there are not-so-old versions with fair usage where it is not. I wouldn't just use it on production. Check the [caniuse.com](//caniuse.com/mdn-css_types_color_light-dark) page of this feature for reference.

The good news is that it is incredibly easy to transpile this at build time.

## How backwards compatibility works

We are used to seeing transpile as a build step for JavaScript, but it can also be done for CSS. This site actually uses modern CSS syntax, which gets transformed to a "more compatible" one.

The build tool I am using, [Lightning CSS](//lightningcss.dev) does something really smart to make this syntax compatible in older browsers.

To understand how it works, we need to break down some implementation details around CSS variables spec you might not be aware of.

The first one, **a variable can take other multiple variable declarations**, it will ignore the unset ones until it sequentially reaches an actual value.

```css
:root {
  --falsy: ;
  --also-falsy: ;
  --truthy: rebeccapurple;
  --color: var(--falsy) var(--also-falsy) var(--truthy);
}

.box {
  background-color: var(--color);
}
```

{% featuredLink '//codepen.io/jeremenichelli/pen/qEWWLgo?editors=0100' %}

An important note, the variables though unset, need to be present. If the parser detects an unpresent or invalid one it will default to `inherit` per spec definition.

Next thing, the `var()` function, **it takes two arguments**. If the variable is not present for that scope, the second one acts as a fallback.

```css
.box {
  width: var(--falsy, 50px);
}
```

Because `--falsy` is not defined, the second value gets computed.

The final bit, and something that surprised me, when the value of the variable in the first argument is `initial`, the variable declaration gets accepted but it resolves to the fallback value.

```css
:root {
  --i: initial;
  --color: var(--i, rebeccapurple);
}

body {
  background-color: var(--color);
}
```

{% featuredLink '//codepen.io/jeremenichelli/pen/jENOpdv?editors=0100' %}

All these three aspects enable an interesting pattern in CSS.

### Logical flags in CSS

Combining all of the above allows you to set a pair of flags you can modify on a media query or under any other selector to modify its value.

```css
:root {
  --flag: initial;
  --negated-flag: ;
}

@media (max-width: 500px) {
  :root {
    --flag:;
    --negated-flag: initial;
  }
}
```

Because there's not a `not` function or a `!` operator as you might know it in JavaScript, you need two variables to hold the negated value of the flag.

This is how you would use it inside a variable declaration.

```css
:root {
  --flag: initial;
  --negated-flag: ;
}

@media (max-width: 500px) {
  :root {
    --flag: ;
    --negated-flag: initial;
  }
}

.box {
  --show-box: var(--flag, block) var(--negated-flag, none);
  display: var(--show-box);
}
```

{% featuredLink '//codepen.io/jeremenichelli/pen/QwLWzLZ?editors=0100' %}

By default, our `--flag` variable has `initial` as value, so `--show-box` resolves to `block`. When the viewport shrinks the media query interchange the two flags values and the second one gets computed.

It looks like over-engineering, but the pattern enables transpiling for `light-dark`.

**Lightning CSS** adds two flags, one for light color scheme and another one for dark, flips their values under the `prefers-color-scheme` media query and transforms the syntax of each function.

So your code goes from this.

```css
:root {
  color-scheme: light dark;

  --background: light-dark(#fefefe, #010101);
  --text: light-dark(#010101, #fefefe);
}
```

To this transpiled result.

```css
:root {
  --light: initial;
  --dark: ;
  color-scheme: light dark;

  --background: var(--light, #fefefe) var(--dark, #010101);
  --text: var(--light, #010101) var(--dark, #fefefe);
}

@media (prefers-color-scheme: dark) {
  :root {
    --light: ;
    --dark: initial;
  }
}
```

This smart trick got me thinking about other media queries that were recently added to the CSS spec and we could take advantage in this form.

## Most of your media queries are binary states

If you think about it, every time you declare a media query, you are creating a binary state. Something applies or doesn't apply depending on a condition.

Inside media queries you add styles for several selectors, modify multiple rules for each or assign new values to CSS variables.

But as I mentioned before, on this last case the amount of lines of code grows and readability takes a toll.

### Media queries as functions

For example the still experimental `prefers-reduced-transparency` query. Important to avoid opaque colors when the user requires it for better readability.

```css
.toolbar {
  background-color: rgba(255, 255, 255, 0.5);
}

media (prefers-reduced-transparency) {
  .toolbar {
    background-color: rgba(255, 255, 255, 1);
  }
}
```

The code could be improved a bit by storing the opacity in a variable.

```css
:root {
  --toolbar-opacity: 0.5;
}

media (prefers-reduced-transparency) {
  :root {
    --toolbar-opacity: 1;
  }
}

.toolbar {
  background-color: rgba(255, 255, 255, var(--toolbar-opacity));
}
```

What if this was under a method syntax too?

```css
:root {
  --toolbar-opacity: reduced-transparency(0.5, 1);
}

.toolbar {
  background-color: rgba(255, 255, 255, var(--toolbar-opacity));
}
```

Another one related to accessibility and widely available is `prefers-reduced-motion`, which could benefit from this form of declaration.

```css
.menu {
  transform: translateX(-100%);
  transition: transform reduced-motion(0s, 500ms) ease-in-out;

  &:is(.expanded) {
    transform: translateX(0);
  }
}
```

Now, imaging being able to apply **any media query** as a function. Something possible via custom media, a feature we are still waiting for browsers to prioritize.

You could declare a custom media query, and then use it at rule level through a method, let's call it `apply-custom-media` for now.

```css
@custom-media --big-devices (min-width: 640px);
@custom-media --not-big-devices (max-width: 639px);

.navigation__desktop {
  display: apply-custom-media(--big-devices, block, none);
}

.navigation__mobile {
  display: apply-custom-media(--not-big-devices, block, none);
}
```

This hypothetical method would take first the name of the custom media, then the value when the query applies, and finally the fallback.

When you need to modify several rules a nested media query might seem a better option, but for single rules and CSS variable declarations it could really benefit the developer experience.

## Further reading

- [You should write modern CSS, today](/2024/11/you-should-write-modern-css-today/) on this blog.
- [Transpilation section](<//lightningcss.dev/transpilation.html#light-dark()-color-function>) on Lightning CSS docs
- [Using CSS custom properties](//developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) on MDN.
- [Can we have custom media queries, please?](//www.stefanjudis.com/notes/can-we-have-custom-media-queries-please/) by Stefan Judis.
