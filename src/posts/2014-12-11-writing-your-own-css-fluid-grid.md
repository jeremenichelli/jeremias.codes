---
title: Writing your own CSS fluid grid
excerpt: The structure and layout of a website or web app is one of the main decisions made over its design.
---

There are a lot of grid systems already built and ready to use like the ones included in Bootstrap or Foundation, but I prefer to build my own and have more control over the layout of my project.

One of the first things I discovered when I started doing my own grids was that it is not a big deal. It involves a little bit of testing but having a grid built by you with your preferences, with no legacy code from other developers is not hard to do.

I'm not saying that other approaches are worse than mine, but my code will cover what I want and yours will cover what you want. In some cases there isn't a better way or a better code, sometimes your code covers your needs and nothing more and that's good. To me it is perfect because no extra code means smaller files, faster loading times and less code to maintain.

A lot of developers told me they don't like doing their own grids because they hate math. Well, math is a big part of building a grid, probably the biggest. I love math and I swear to you it's not that complicated.

## Define your layout

The first thing you need to define is how many combinations and number of columns you're going to use. Take count that using three columns in your grid doesn't mean you're going to use a three columns grid system, what if the three columns need different widths? Then you may need a ten column one, or a twelve one. I usually go for a twelve but that depends entirely on the project you're working on.

## Let the math begin

This is the fun part to me, I hope I'm not alone. We are going to build a twelve columns grid system, that means that our number of columns is **12**. Next step, how much gap do we want between the columns? Since we're talking about a fluid grid it needs to be in percents, I will go for a gap of **3%**.

### The smallest part

I always say that when solving a problem, we need to think **atomically**, if that's a word. First solve the smallest parts, the leaves of the tree and then go for the big ones.

Here we need to know the width of a one span column, a two span column and so on until we get to the eleven span column width value. The twelve span column width is obviously **100%** in this case. So, the first thing to calculate here is the width of the one span column.

For that it is necessary to know how much space we have available by subtracting the sum of gaps. Imagine a row with twelve single columns, there's going to be eleven gaps so:

```
FORMULA
available_space = 100 - [(number_of_columns - 1) * gap]

REPLACE WITH YOUR VALUES
available_space = 100 - [(12 - 1) * 3]
available_space = 100 - (11 * 3)
available_space = 100 - 33
available_space = 67
```

Now that we have that number, we need to divide it by the number of columns to get the width of a single one:

```
FORMULA
one_span_col = available_space / number_of_columns

REPLACE WITH YOUR VALUES
one_span_col = 67 / 12
one_span_col = 5.58333333
```

Yay! We have our first value. For the rest column spans we need to do that value as many times as the span and add the gap value as many times as the span minus one:

```
FORMULA
span_width = span * one_span_col + gap * (span - 1)

REPLACE WITH YOUR VALUES
two_span_col = 2 * 5.58333333 + 3 * (2 - 1)
two_span_col = 2 * 5.58333333 + 3 * 1
two_span_col = 2 * 5.58333333 + 3
two_span_col = 2 * 5.58333333 + 3
two_span_col = 11.1666667 + 3
two_span_col = 14.1666667
```

There you go, with that formula you can get all the width values you need. For this example those values would be:

```
column-1 = 5.583333333333333%
column-2 = 14.166666666666666%
column-3 = 22.75%
column-4 = 31.333333333333332%
column-5 = 39.916666666666664%
column-6 = 48.5%
column-7 = 57.08333333333333%
column-8 = 65.66666666666666%
column-9 = 74.25%
column-10 = 82.83333333333333%
column-11 = 91.41666666666666%
column-12 = 100%
```

This values were obtained by doing these calculations with javaScript. I've changed the name of our columns and added the percent symbol because now we have to think about the styles we need to make this work.

## The styles

Writing the styles is the simplest part in my opinion. We're going to use a class called _column_ for the properties that all the columns have in common and then _column-1_, _column-2_ ... _column-12_ for each specific one. This is personal, you can choose another name convention as long as it makes sense to you and your team.

For the common styles the first thing we need is to float them so they stick side by side, we can't use _inline-block_ because it adds extra space between the elements, we don't want that at all. The next property is a left margin with the value of the gap we decided and last but not least, _min-height: 1px_, why? Because if the column doesn't have any content it will collapse and gain no width breaking our grid.

We still need one more tweak to do, the first column of each row doesn't need a left margin, or the sum of the widths will be 103%. Yeah, it doesn't sound good.

```css
.column {
  float: left;
  margin-left: 3%;
  min-height: 1px;
}

.column:first-child {
  margin: 0;
}

.column-1 {
  width: 5.583333333333333%;
}
.column-2 {
  width: 14.166666666666666%;
}
.column-3 {
  width: 22.75%;
}
.column-4 {
  width: 31.333333333333332%;
}
.column-5 {
  width: 39.916666666666664%;
}
.column-6 {
  width: 48.5%;
}
.column-7 {
  width: 57.08333333333333%;
}
.column-8 {
  width: 65.66666666666666%;
}
.column-9 {
  width: 74.25%;
}
.column-10 {
  width: 82.83333333333333%;
}
.column-11 {
  width: 91.41666666666666%;
}
.column-12 {
  width: 100%;
}
```

For this to work we need to wrap every row within a _&lt;div&gt;_ tag.

## The markup

We need a row class element and then fill it up with the columns we want.

```html
<div class="row">
  <div class="column column-4"></div>
  <div class="column column-6"></div>
  <div class="column column-2"></div>
</div>
```

That's pretty simple and clean, isn't it? If we want vertical spacing my recommendation is to add a _margin-top_ to the **row** class, but you can get the same effect by adding this property to the **column** class.

## What about mobile?

In order to have a grid completely responsive we need to add a media query to our style sheet and make some changes to our columns.

They need to cover the whole width, remove the float and the left margin and add a top margin or they will have no vertical spacing between each other, I'll choose _20px_ as an example.

```css
@media (max-width: 768px) {
  .column {
    float: none;
    margin: 20px 0 0;
    width: 100%;
  }
}
```

And that’s it!

## Wrap-up

I may have forgotten something up there, if you found out I did don't hesitate to contact me by email or twitter so we can discuss it. If my explanation sucked all the way I've built an [automatic grid builder](//jeremenichelli.github.io/gridbuilder/), it's not perfect and still needs some work but it will give you the main styles right away.
