---
layout: base
title: Writing
type: writing
excerpt: List of articles written for this blog and other publications.
tag_line: Are you looking for a guest writer? Click [here](mailto:jmenichelli@gmail.com) to contact me.
---

<div class="section section__with-divider">
  <ol class="list" role="list" aria-label="Articles">
    {%- for post in collections.posts -%}
      <li class="list__item" role="listitem">
        <h2 class="list__title">
          <a class="list__title__link" href="{{ post.url }}">{{ post.data.title }}</a>
        </h2>
        <p class="list__subtitle">
          <time datetime="{{ post.date | date: '%Y-%m-%d' }}">{{ post.date | date: '%b %d, %Y', 'UCT' }}</time>
          {%- if post.data.host -%}
            &nbsp;<span class="list__host">For {{ post.data.host }}</span>
          {%- endif -%}
        </p>
      </li>
    {%- endfor -%}
  </ol>
</div>
