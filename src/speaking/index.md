---
layout: base
title: Speaking
type: speaking
excerpt: Besides some speaking, workshop and presenting at events in the past, my community efforts go on making JSHeroes the best conference possible.
tag_line: Are you looking for a speaker? Click [here](mailto:jmenichelli@gmail.com) to contact me.
---

<div class="section section__with-divider">
  <ol class="list" role="list" aria-label="Talks and workshops">
    {%- for talk in talks -%}
      <li class="list__item" role="listitem">
        <h2 class="list__title">
          <a class="list__title__link" href="{{ talk.url }}" target="_blank" rel="noopener noreferrer">{{ talk.title }}</a>
        </h2>
        <p class="list__subtitle">
          <time datetime="{{ talk.date | date: '%Y-%m-%d' }}">{{ talk.date | date: '%b %d, %Y', 'UCT' }}</time> <span class="list__host">For {{ talk.event }}</span>
        </p>
      </li>
    {%- endfor -%}
  </ol>
</div>
