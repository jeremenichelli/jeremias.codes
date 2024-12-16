---
title: This website has cheat codes
excerpt: One of the coolest things from the latest revamp of my personal site is the theme menu behind that circular button on the top right corner. You can click it and choose any of the available options. **But what if I told you there are some secret ones behind cheat codes?** In this post I will explain how to activate them and walk you through the implementation.
---

I really enjoy whimsical and creative sites. When it comes to designing my own site though, I have to admit my taste is pretty boring.

Don't get me wrong, I am happy with how this recent version turned out, I love minimalism and not-super-busy design.

In the end, your site should be a reflection of who you are, and I am boring.

On the inside though, just like everyone, I am a bit more complex and weird. You, reading that last sentence, might be thinking _"Actually no, I am not weird"_.

**Well bad news, you are**. We all are. And weird is good.

So I started to think about how I could add some weirdness into this website.

## Anyone had a video game era, right?

I am definitely not one today, but as a kid I was a bit more of a gamer.

I had a NES, then a Sega Genesis, and later the first PlayStation. I also loved adventure games like Monkey Island, and played Pokemon, like a lot.

Most of those games I played had cheat codes, combinations of buttons you would smash to unlock something like unlimited resources, skip a level or break a little bit the physics of the game to make it easier.

**But why would a game developer allow you to cheat?** Initially those secret codes were there for developers to go faster through the games while testing them.

Cheat codes made building and testing games bearable, but once developers forgot to delete them before release, and they became available to the player.

Enough story time, let me show you how I got a cheat codes script working.

## A cheat codes mechanism for JavaScript

The basic functionality of our script will be to listen to consecutive commands, and when they correspond to a secret code, to run something.

For us on the web, those commands will be keystrokes.

The only rule is for these inputs to happen within a certain interval of time. If the user hits them slower than expected, the sequence gets dropped.

Let's start by defining this interval in milliseconds and save it in a constant.

```js
const INTERVAL = 750;
```

Next, we listen to every `keydown` event and save the last time it took place.

With a little math, we can get how many milliseconds passed between the current event and the previous one. That already gives us the condition we need.

```js
let lastInputTime = performance.now();

window.addEventListener('keydown', (event) => {
  const now = performance.now();
  const timeElapsed = now - lastInputTime;

  if (timeElapsed > INTERVAL) {
    // Oh no! Too slow.
  } else {
    // Within the interval.
  }

  lastInputTime = now;
});
```

To track the sequence of inputs by the user, we make use of the `code` property from the keyboard event object and accumulate the values in a variable.

When the time window between events is larger than our interval, we drop those previous values and start all over again.

```js
let lastInputTime = performance.now();
let storedInput = '';

window.addEventListener('keydown', (event) => {
  const now = performance.now();
  const timeElapsed = now - lastInputTime;

  if (timeElapsed > INTERVAL) {
    storedInput = event.code;
  } else {
    storedInput += event.code;
  }

  lastInputTime = now;
});
```

The keyboard event object holds several references to the pressed key, but `code` returns the same value for letters whether they are in lowercase or uppercase.

_This removes the need for sanitizing the input string, simplifying our code._

We can reduce our logic to this.

```js
let lastInputTime = performance.now();
let storedInput = '';

window.addEventListener('keydown', (event) => {
  const now = performance.now();
  const timeElapsed = now - lastInputTime;

  if (timeElapsed > INTERVAL) {
    storedInput = '';
  }

  storedInput += event.code;

  lastInputTime = now;
});
```

Now, let's build our collection of cheat codes, starting with a simple object with a _code_ property holding the sequence of keys we expect, and the _action_ to execute when it gets detected.

```js
const cheatCode = {
  code: 'KeyAKeyBKeyCKeyD',
  action: () => console.log('Cheat code activated!')
};
```

In this example, the code corresponds to the **A**, **B**, **C** and **D** key sequence.

_You can check in keycode.info the references in the event object for different keys, it will help you read the cheat codes present in following code snippets._

We want more than one cheat code, so we place the one we just created and any additional ones in an iterable.

```js
const cheatCodes = [
  {
    code: 'KeyAKeyBKeyCKeyD',
    action: () => console.log('Cheat code activated!')
  },
  {
    code: 'Digit1Digit2Digit3Digit4',
    action: () => console.log('Second cheat code activated!')
  }
];
```

Finally, for each event the user triggers we go over our array, and when a `code` equals our `storedInput` variable, we call the corresponding `action` method.

```js
let lastInputTime = performance.now();
let storedInput = '';

window.addEventListener('keydown', (event) => {
  const now = performance.now();
  const timeElapsed = now - lastInputTime;

  if (timeElapsed > INTERVAL) {
    storedInput = '';
  }

  storedInput += event.code;

  cheatCodes.forEach(({ code, action }) => {
    if (code === storedInput) {
      action();
    }
  });

  lastInputTime = now;
});
```

_If you are reading this on a device with no keyboard, the rest of this section might be a bit boring. Sorry for that._

Let's give all this a try, type **A**, **B**, **C** and **D** here, be careful with typos!

<p>
<strong><em data-code="KeyAKeyBKeyCKeyD">...</em></strong>
</p>

Now, try typing **1**, **2**, **3** and **4** for the second one.

<p>
<strong><em data-code="Digit1Digit2Digit3Digit4">...</em></strong>
</p>

There you go, we have cheat codes on a website! You can click [this link](//codepen.io/jeremenichelli/pen/PwYbdWx?editors=0010) to find the whole solution for you to revisit, copy or play around with it.

Alright, let's explore the actual cheat codes present on this site.

## Hidden themes

Building a theme menu here is what initially sparked the idea of having a couple of options hidden behind cheat codes.

Unlocking any new theme immediately sets it, and adds an option within the theme menu to select it whenever you want.

The first one is behind **the Konami code**, probably the most famous of the cheat codes in the history of video games.

Press **↑**, **↑**, **↓**, **↓**, **←**, **→**, **←**, **→**, **B**, and **A** really quick.

<p>
<strong>
 <em class="konami--locked">...</em>
 <em class="konami--unlocked">You have unlocked the Konami theme!</em>
</strong>
</p>

The result is the **Konami** theme. With a vintage vibe, it brings the orange and red colors from the logo the company had in 1986, casually the year I was born.

For the second one I used the level select cheat code from the original **Sonic, The Hedgehog** game. This one is a bit easier.

Press **↑**, **↓**, **←**, **→**, **A** and **ENTER**, and don't be slow!

<p>
<strong>
 <em class="hedgehog--locked">...</em>
 <em class="hedgehog--unlocked">You have unlocked the Hedgehog theme!</em>
</strong>
</p>

You might recognize the colors on this one from the main character. A striking blue, some red accent from the shoes, and yellow for the rings in the game.

It's hideous, I love it.

## Other cheat codes

After all the mechanism was up and running, it became ridiculously trivial to just keep adding more of them.

As I mentioned, cheat codes were there for testing purposes, this eventually became a need for me too. To make it easier to reset the theme menu back to its initial state, I created another cheat code.

Type **GAMEOVER** to reset the theme menu.

<p>
<strong><em data-code="KeyGKeyAKeyMKeyEKeyOKeyVKeyEKeyR">...</em></strong>
</p>

After this one runs, the site goes back to **SYSTEM**, which is the default theme and the hidden ones are gone. You can always redo the cheat codes from the previous section to gain them back.

Another fun command, type **RANDOM** and a theme will be picked for you.

## Wrap-up

Personal sites are our homes on the internet, an expression of who we are.

The technologies we use to build them, their design, the content we put on them, and their funny corners say something about us.

This is the happiest I've ever been with mine.

Oh, the last one for now, do you want to go to the top? Well, type **TOP**.

{% style '__posts-cheat-codes.css' %}
{% script '__posts-cheat-codes.js' 'defer' %}
