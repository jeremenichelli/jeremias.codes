---
layout: base
title: Speaking
type: speaking
excerpt: I used to give talks and enjoyed it a lot, made tons of friends. For now I stopped. I might get back to it in the future, or not.
tag_line: In the meantime my community efforts go to being the best ambassador possible for [JSHeroes](//jsheroes.io/) conference.
---

<div class="section section__with-divider">
  <ol class="list" role="list" aria-label="Talks and workshops">
    {%- for talk in talks -%}
      <li class="list__item" role="listitem">
        <h2 class="list__title">
          <a class="list__title__link" href="{{ talk.url }}" target="_blank" rel="noopener noreferrer">{{ talk.title }}</a>
        </h2>
        <p class="list__subtitle">
          <time datetime="{{ talk.date | date: '%Y-%m-%d' }}">{{ talk.date | date: '%b %d, %Y' }}</time> <span class="list__host">For {{ talk.event }}</span>
        </p>
      </li>
    {%- endfor -%}
  </ol>
</div>
