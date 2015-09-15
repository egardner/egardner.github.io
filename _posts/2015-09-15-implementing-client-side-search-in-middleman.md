---
layout: article
published: false
title: "Client-side Search in Middleman"
---

As part of the "Octavo" project to create a framework for making immersive digital publications using "static" web tools (no server-side requirements, database connections, etc.), I recently spent a lot of time implementing a client-side search tool in our working prototype. I want to collect some of my thoughts on this process while they are still fresh in my mind.

### Tools Used
- Middleman static site generator
- YAML & Markdown files for human-readable source material
- Javascript (ES5) + jQuery
- [Lunr.js](http://lunrjs.com/)
- [Handlebars.js](http://handlebarsjs.com/)

### Overview
Static web publishing tools have come a long way in the last few years. For a long time I've been a huge fan of [Jekyll](http://jekyllrb.com/)(which powers this website). More recently I have been making use of [Middleman](https://middlemanapp.com), which offers a bit more flexibility for non-blog use-cases. Both Middleman and Jekyll are built in Ruby, but similar static-site generators exist for [a bewildering array of other ecosystems](https://www.staticgen.com/). For lots of applications, there is simply no reason to rely on a live server or database – and the advantages of simplifying are big (no need to keep track of security/maintenance updates, a much longer shelf-life, speed & performance, etc.).

Search is one feature that used to be a deal-breaker for going down the route of a static site. If the user expects to have the ability to easily search through content at a granular level (an increasingly common expectation), what can you do without a database to query based on their requests?





