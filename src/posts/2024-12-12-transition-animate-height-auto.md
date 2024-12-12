---
title: This is how you should transition height between zero and auto
excerpt: We are finally getting one of the most requested things in CSS, transitioning between sizing keywords and values, but it will take some time until it gets to all modern browsers. Here's how you can approach in the meantime.
---

Imagine just doing this to collapse and expand something.

```css
.box {
  height: 0;
  transition: height 300ms;
  overflow: hidden;

  &.expanded {
    height: auto;
  }
}
```

{% featuredLink '//codepen.io/jeremenichelli/pen/qEWaOeV' %}

In the example above, you might notice how the `height` of the element actually changes, but there's no transition in between.

The ability to do this in CSS has been on the [wishlist](//css-tricks.com/2019-css-wishlist/) of almost everyone in web development for years. There's now an experimental feature that makes this possible, but it will take some time until it becomes widely available.

The theme menu on this site, the circle button on the top-right corner, expands and collapses a menu that needed this. Here's the recipe I came up with.

## CSS variables and a bit of JavaScript

Solutions to this problem that work in all browsers require some scripting to extract the `scrollHeight` value of the element.

By doing this you don't need much more since `auto` both as an end value or starting one is what prevented the transition from happening.

```js
const toggleBox = () => {
  const box = document.querySelector('.box');
  const isExpanded = box.classList.contains('expanded');

  if (isExpanded) {
    box.style = 'height: 0;';
  } else {
    box.style = `height: ${box.scrollHeight}px;`;
  }

  box.classList.toggle('expanded');
};
```

{% featuredLink '//codepen.io/jeremenichelli/pen/vEBXLPq' %}

The caveat is the element ends up with a hardcoded height, which doesn't allow the element to adapt when its content mutates once expanded.

This was the case for me. The menu has two hidden themes under cheat codes which could be activated while it's open. A hardcoded height prevents the menu from adapting to any item addition or deletion.

I needed `auto` as the end value after expanding it.

In my solution to this, I first moved the `height` to its own CSS variable.

```css
.box {
  --height: 0;

  height: var(--height);
  transition: height 300ms;
  overflow: hidden;
}
```

On the scripting side, we now toggle the value of this CSS property.

```js
const toggleBox = () => {
  const box = document.querySelector('.box');
  const isExpanded = box.classList.contains('expanded');

  if (isExpanded) {
    box.style.setProperty('--height', '0px');
  } else {
    box.style.setProperty('--height', `${box.scrollHeight}px`);
  }

  box.classList.toggle('expanded');
};
```

Next we need to assign `auto` to our variable, but only after the transition has finished.

Luckily, we can listen to the `transitionend` event in our element.

```js
const toggleBox = () => {
  const box = document.querySelector('.box');
  const isExpanded = box.classList.contains('expanded');

  if (isExpanded) {
    box.style.setProperty('--height', '0px');
  } else {
    const onTransitionEnd = (event) => {
      if (event.propertyName === 'height') {
        box.style.setProperty('--height', 'auto');
        box.removeEventListener('transitionend', onTransitionEnd);
      }
    };

    box.addEventListener('transitionend', onTransitionEnd);
    box.style.setProperty('--height', `${box.scrollHeight}px`);
  }

  box.classList.toggle('expanded');
};
```

On the expanded flow, we add an event listener, and inside of it we check the transition corresponds to the `height` property.

This is crucial because while expanding, other properties might transition, like opacity, but we are only interested in the `height` one.

For this exact same reason we are removing the listener manually instead of using the `once` event modifier. Other properties could fire this event and remove it before we wanted to.

The collapsing flow is a bit more tricky. We can't transition from `auto` either, so we first need to assign the variable the `scrollHeight` of the element. The problem is this on itself triggers a transition.

The solution is to wait for that one to finish, and then set the height to zero. This can be achieved by waiting two animation frames.

**Why two?** In the next frame after we set the variable to `scrollHeight` the transition will be in progress, and interrupting will fast-forward to its final computed state.

The one after the next one is what we want. So, queuing the reset to zero for two frames ensures it happens at the correct time.

```js
const toggleBox = () => {
  const box = document.querySelector('.box');
  const isExpanded = box.classList.contains('expanded');

  if (isExpanded) {
    box.style.setProperty('--height', `${box.scrollHeight}px`);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        box.style.setProperty('--height', '0px');
      });
    });
  } else {
    const onTransitionEnd = (event) => {
      if (event.propertyName === 'height') {
        box.style.setProperty('--height', 'auto');
        box.removeEventListener('transitionend', onTransitionEnd);
      }
    };

    box.addEventListener('transitionend', onTransitionEnd);
    box.style.setProperty('--height', `${box.scrollHeight}px`);
  }

  box.classList.toggle('expanded');
};
```

{% featuredLink '//codepen.io/jeremenichelli/pen/EaYgKpz' %}

These necessary workarounds do the trick, we have an element that expands with `auto` as a final state. Hopefully, all of them will become obsolete soon.

### Accessibility checks

When the user prefers reduced motion, we should prevent any animation or transition from taking place. Something not complex to implement.

```css
@media (prefers-reduced-motion: reduced) {
  .box {
    transition-duration: 0s;
  }
}
```

Sadly, this breaks our code. The reason is browsers skip zero seconds transitions entirely. End styles are computed, transition events don't fire and animation frames are skipped, causing part of our code to never run.

Setting a really short amount of time as duration makes it functional again.

```css
@media (prefers-reduced-motion: reduced) {
  .box {
    transition-duration: 0.01s;
  }
}
```

Users will still see no motion, but frames and events will fire accordingly, adding accessibility to our solution while keeping our code safe.

## A CSS-only approach for the future

Not present in all browsers but Chromium ones at the moment, there are two new ways to achieve these transitions only using CSS, the `interpolate-size` property and the `calc-size()` function.

Going back to the first code snippet in this article, a single line of CSS would need to be changed.

```css
.box {
  height: 0;
  transition: height 300ms;
  overflow: hidden;

  &.expanded {
    height: calc-size(auto, size);
  }
}
```

{% featuredLink '//codepen.io/jeremenichelli/pen/raBMLXM' 'Try this on the latest version of Chrome' %}

You can even use a progressive enhancement technique here, placing first the fallback value for unsupported browsers and later the modern one.

```css
&.expanded {
  height: auto;
  height: calc-size(auto, size);
}
```

This way the transition will run in browsers with `calc-size()` support, while the element will still expand and collapse with no animation on the rest.

If you want to learn how this new function works or check the `interpolate-size` property approach, I suggest reading [this article](//developer.chrome.com/docs/css-ui/animate-to-height-auto) in the Chrome for Developers site.
