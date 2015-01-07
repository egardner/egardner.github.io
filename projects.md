---
title: Projects
Permalink: /projects/
---
Projects index goes here.

{% for project in site.projects %}
  <ul>
  	<li>
  		<a href="{{site.baseurl}}{{project.url}}">{{project.title}}</a>
  	</li>
  </ul>
{% endfor %}