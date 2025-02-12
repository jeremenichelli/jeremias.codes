---
title: npm install debate
excerpt: About a few hours ago, eleven lines of code disappeared and thousands of projects broke. As every time something not so good happens in the industry, we have to talk about it.
---

In case you haven't heard, a developer took a really drastic decision and unpublished all of his modules from **npm** &mdash; I suggest reading [his post](//medium.com/@azerbike/i-ve-just-liberated-my-modules-9045c06be67c#.os2dtmfji) to understand better why he did it.

This could have been a minor thing, but popular libraries and tools such as **Babel** depended on one of his modules and builds started to break everywhere.

## Moving fast

Industry is making us solve stuff quickly, build stuff quickly, and that comes at a price. Moving fast has its consequences like not having a **plan B**, or having a not so good **plan A**.

I'm pretty sure that an event like this wouldn't have been possible in the front end community just a couple of years ago because the needs really differed from the ones we have today.

{% blockquote 'Change is constant.' 'Benjamin Disraeli' %}

We are in the presence of one of those big moments when we find out that something is not as good as we thought and we need to evolve and find a solution.

## We can do better

As Azer, I wouldn't be **that** happy if someone else took possession of one of my packages deliberately. I invested my time on that and kindly opened it to the community for free use.

_What could Azer have done better?_ Knowing that thousands of projects might be affected, inform developers that a package won't be available through **npm** in a week or a month.

Some people had a horrible time trying to find out why their projects were breaking. When the reason was revealed some of them understood his reasons, but [didn't agree with him](//github.com/azer/left-pad/issues/4#issuecomment-200066563) and probably both are right.

_What could we have done better?_ We are relying **a lot** in **npm modules**, or at least we need a back up plan. I'm sure that having this discussion will take us somewhere better.

Rich Harris published [his solution](//medium.com/@Rich_Harris/how-to-not-break-the-internet-with-this-one-weird-trick-e3e2d57fee28#.51bhkzdaj) for this.

_What could npm have done better?_ Probably ask lawyers for more time to explain the situation to the community, and be more open about what was happening. I don't quite agree with what they did, but maybe this whole lawyer thing got them scared, I don't know.

By the time I was writing this there was no formal statement from **npm**, but we will have one soon for sure. I'm sure they are not happy with this whole thing either.

When you think about it, this sounds more like a communication problem than a technology one.

I think it is time to learn from this, find solutions to build more bulletproof stuff in the future, to be more open when we know our actions can affect others.

## Wrap-up

As any group of individuals, we developers see the same thing from a different perspective and we are building our careers and our lives from there.

Something went wrong. It means we need to do it better. We can do better.

_Let's!_
