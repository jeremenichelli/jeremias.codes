---
title: What if media queries were CSS functions
excerpt: While rebuilding this site I went all-in for newer CSS features. One of them was the light-dark function, which reduced the amount of code needed for theming by a lot. It got me thinking, what would happen if other media queries were also functions?
---

There are many versions of color scheme controls around the web. Binary switches with both light and dark options, triple state controls with an additional system choice, and other sites directly consume this system value.

The CSS spec allowed us to tap into this last one fairly easily.

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

Small sites and maybe some side projects are fine with a small group of variables, but things get messier when you are in a complex product.

In design systems and applications I worked in the past, we had hundreds of color tokens, making maintenance a real burden.

We, humans, struggle a lot with long lists, so you could easily miss the dark version of one of those tokens, misspell one, or even forget to delete deprecated ones.

## The new light-dark function

We saw function notation in CSS first in transform methods and new color models, and now it's becoming a pretty common pattern in newer features.

For light-dark uses this syntax, and allows you to define the color on the light scheme and the dark one for a property or variable in the same line.

```css
:root {
  color-scheme: light dark;

  --background: light-dark(#fefefe, #010101);
  --text: light-dark(#010101, #fefefe);
}
```

If you have a big collection of variables, it literally halves the amount of lines you need, and eliminates the need for the media query wrapping.

Though it is already present in all modern browsers, their inclusion was recent so I wouldn't just use it on production.

Good news is it is incredibly easy to transpile this feature at build time.

## How backwards compatibility works

We are used to seeing transpile as a build step for JavaScript, but it can also be done for CSS. This site actually uses modern CSS syntax, which gets transformed to a "more compatible" one.

The build tool I am using, [Lightning CSS](//lightningcss.dev) does something really smart to make this compatible in older browsers. To understand how it works, we need to break down some implementation details around CSS variables you might not be aware of.

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

Next thing, the `var()` function **takes two arguments**, when the variable in the first position is not present, the value on the second one acts as a fallback.

```css
.box {
  width: var(--falsy, 50px);
}
```

Because `--falsy` is not defined, the second value gets computed.

The final bit that surprised me, when the value of the variable in the first argument is `initial` its declaration gets accepted, but resolves to the fallback value.

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

Combining all of the above, you can set a pair of flags you can modify on a media query or under any other selector to later use as a single line condition for properties.

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
```

Because there's not a `not` function or a `!` operator as you might know it in JavaScript, we need two variables to hold the negated value of the flag.

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

All the double flag management might look like over-engineering just to modify a property, but notice how display is only declared just once.

This is the pattern that enables transpiling for `light-dark`.

### The final result

What you saw is what **Lightning CSS** actually does.

It sets two global flags, one for light color scheme and another one for dark, flips their values under the `prefers-color-scheme` media query and transforms each `light-dark` occurrence to a set of flagged variables.

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

This smart trick got me thinking about other media queries recently added to the CSS spec that we could use in this form.

## Media queries are binary states

If you think about it, every time you declare a media query, you are creating a binary state. Something applies or doesn't apply depending on a condition.

This is why this new `light-dark` function makes so much sense. Let's expand this syntax to other similar media queries.

For example the still experimental `prefers-reduced-transparency` one. Important to avoid opaque colors when the user requires it for better readability.

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

Much shorter but still easy to reason what's going on.

Another query widely available is `prefers-reduced-motion`, which could also benefit from this form of declaration.

```css
.menu {
  transform: translateX(-100%);
  transition: transform reduced-motion(0s, 500ms) ease-in-out;

  &:is(.expanded) {
    transform: translateX(0);
  }
}
```

Let's expand this even a bit further.

Imagine being able to apply **any media query** as a function. Something like this could be possible by combining **custom media** with this syntax.

Let's call this hypothetical new feature `apply-custom-media` for now.

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

The function would take first the name of the custom media, then the value when the query applies, and finally a fallback.

The best thing, both features are easy to transpile until they get widely adopted.

## Wrap-up

When you need to modify several rules or selectors, a nested media query seems like a better option, but for single line modifications and CSS variable declarations custom media plus value functions syntax could be a game changer in developer experience.

## Further reading

- [CSS value functions](//developer.mozilla.org/en-US/docs/Web/CSS/CSS_Functions) on MDN.
- [You should write modern CSS, today](/2024/11/you-should-write-modern-css-today/) on this blog.
- [Transpilation section](<//lightningcss.dev/transpilation.html#light-dark()-color-function>) on Lightning CSS docs
- [Using CSS custom properties](//developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) on MDN.
- [Can we have custom media queries, please?](//www.stefanjudis.com/notes/can-we-have-custom-media-queries-please/) by Stefan Judis.
