---
title: Always animate translate instead of positions
excerpt: While visiting an article in WebKit's blog I noticed how badly an animation in a nested menu performed and decided to fix it.
lastModified: 2014-04-07
---

Not only was it slow, you could actually see the browser pushing each pixel of the menu with their list of links so I inspected its styles and this was the output.

```css
/*
 * I deleted the styles that don't matter
 * to this case study
 */

.sub-menu-layer {
  opacity: 0;
  position: absolute;
  top: 7rem;
  transition:
    opacity 0.6s,
    top 0.6s;
}

.menu-item:hover .sub-menu-layer {
  opacity: 1;
  top: 8rem;
}
```

As you might have noticed that this code is animating from `7rem` to `8rem` the `top` property giving the menu a slide in entrance effect.

This triggers layout and paint unnecessarily while we could use composition properties and improve frames per second numbers making it smoother visually speaking.

The solution is to take the element to its final position by default, add a negative translate value on the **y axis** and reset it on hover.

```css
.sub-menu-layer {
  opacity: 0;
  position: absolute;
  top: 8rem;
  transform: translateY(-1rem);
  transition:
    opacity 0.6s,
    transform 0.6s;
}

.menu-item:hover .sub-menu-layer {
  opacity: 1;
  transform: translateY(0);
}
```

**Done!** This runs smoothly now.

## User experience and animation times

Still the transition duration is **600ms** and that is too much. Users expect micro animations like this one to finish in **~350ms** or they will feel they are waiting for it.

If you want to create a nice _but not immediate_ animation it is better to add a subtle delay to it.

```css
.sub-menu-layer {
  opacity: 0;
  position: absolute;
  top: 8rem;
  transform: translateY(-1rem);
  transition:
    opacity 0.35s,
    transform 0.35s;
  transition-delay: 0.05s;
}

.menu-item:hover .sub-menu-layer {
  opacity: 1;
  transform: translateY(0);
}
```

The transition delay should not exceed the **100ms** neither or users will perceive it as unresponsive.

### Recommended links

- Post by Paul Irish about the benefits of [moving objects using translate][1].
- Google Developers article on [composition layers and animation][2].
- UX question in StackOverflow about [optimal duration on transitions][3].

## Wrap-up

When animating elements, think of a way to accomplish the desired effect using transform operations and opacity to avoid underperformance results and show nice animations and transitions to the user.

### Updates

**7 APR 2014** &mdash; After reporting this to the WebKit team about this, they quickly fixed and shipped the new improved transitions to their site.

[1]: //www.paulirish.com/2012/why-moving-elements-with-translate-is-better-than-posabs-topleft/
[2]: //developers.google.com/web/fundamentals/performance/rendering/stick-to-compositor-only-properties-and-manage-layer-count?hl=en
[3]: //ux.stackexchange.com/questions/66604/optimal-duration-for-animating-transitions
