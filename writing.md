---
title: Writing
layout: page
---

{% for post in site.posts %}
  <ul>
    <li>
      <a href="{{site.baseurl}}{{post.url}}">{{post.title}}</a>
    </li>
  </ul>
{% endfor %}