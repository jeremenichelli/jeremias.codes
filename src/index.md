---
layout: base
type: home
title: Jeremias Menichelli
subtitle: curious mind, developer and writer
excerpt: Over a decade building seamless web experiences. Web accessibility advocate. Technical lead behind award-winning sites. Design system tinkerer. Community and event ambassador.
excerpt_2: Explore more in detail all these skills&mdash;[accessibility](/about/#accessibility), [design systems](/about/#design-systems), [platform and developer experience](/about/#platform-and-developer-experience), [digital experiences and tech leading](/about/#digital-experiences-and-tech-leading) and [community](/about/#community)&mdash;in the [about](/about) page.
tag_line: You can also see a summary of my [experience](/about/#experience) and projects.
---

<div class="section section__with-divider">
  <header>
      <h2 class="section__title" id="latest-articles">Latest articles</h2>
  </header>
  <ol class="list" role="list" aria-labelledby="latest-articles">
    {%- for post in collections.latestPosts -%}
      <li class="list__item" role="listitem">
        <h3 class="list__title">
          <a class="list__title__link" href="{{ post.url }}">{{ post.data.title }}</a>
        </h3>
        <p class="list__subtitle">
          <time datetime="{{ post.date | date: '%Y-%m-%d' }}">{{ post.date | date: '%b %d, %Y', 'UCT' }}</time>
          {%- if post.data.host -%}
            &nbsp;<span class="list__host">For {{ post.data.host }}</span>
          {%- endif -%}
        </p>
      </li>
    {%- endfor -%}
  </ol>
  <div class="card">
    <p class="card__tag-line">See the full list of <a href="/writing">articles here</a>.</p>
  </div>
</div>
