---
layout: base
type: home
title: Jeremias Menichelli
subtitle: curious mind, developer and writer
excerpt: Over a decade building seamless web experiences. Web accessibility advocate. Technical lead behind award-winning sites. Design system tinkerer. Community and event ambassador.
tag_line: Check all my past and current projects in my [about](/about) page.
---

<div class="section section__with-divider">
  <header>
      <h2 class="section__title">Writing</h2>
  </header>
  <ol class="list" role="list" aria-label="Articles">
    {%- for post in collections.latestPosts -%}
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
  <article class="card">
    <p class="card__tag-line">See the full list of <a href="/writing">articles here</a>.</p>
  </div>
</div>
