---
layout: base
title: Writing
type: writing
excerpt: I often turn my thoughts and experiences into articles. Check out them all out here, from the early days of blogging until now.
tag_line: Do you want me to write for your publication? Click [here](mailto:jmenichelli@gmail.com) to contact me via email.
---

<div class="section section__with-divider">
  <ol class="list" role="list">
    {%- for post in collections.posts -%}
      <li class="list__item" role="listitem">
        <h3 class="list__title">
          <a class="list__title__link" href="{{ post.url }}">{{ post.data.title }}</a>
        </h3>
        <p class="list__subtitle">
          <time datetime="{{ post.date | date: '%Y-%m-%d' }}">{{ post.date | date: '%b %d, %Y' }}</time>
          {%- if post.data.host -%}
            &nbsp;<span class="list__host">For {{ post.data.host }}</span>
          {%- endif -%}
        </p>
      </li>
    {%- endfor -%}
  </ol>
</div>
