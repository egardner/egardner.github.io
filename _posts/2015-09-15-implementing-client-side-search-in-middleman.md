---
layout: article
published: false
title: "Client-side Search in Middleman"
---

### Tools Used
- Middleman static site generator
- YAML & Markdown files for human-readable source material
- Javascript (ES5) + jQuery
- [Lunr.js](http://lunrjs.com/)
- [Handlebars.js](http://handlebarsjs.com/)

### Overview
Static web publishing tools have come a long way in the last few years. For a long time I've been a huge fan of [Jekyll](http://jekyllrb.com/)(which powers this website). More recently I have been making use of [Middleman](https://middlemanapp.com), which offers a bit more flexibility for non-blog use-cases. Both Middleman and Jekyll are built in Ruby, but similar static-site generators exist for [a bewildering array of other ecosystems](https://www.staticgen.com/). For lots of applications, there is simply no reason to rely on a live server or database – and the advantages of simplifying are big (no need to keep track of security/maintenance updates, a much longer shelf-life, speed & performance, etc.).

Search is one feature that used to be a deal-breaker in building a static site. If the user expects to have the ability to easily search through content at a granular level (an increasingly common expectation), what can you do without a database to query based on their requests?

### Client-side Search
Client-side search tools are a way to provide this functionality without relying on a back-end to do the querying. There are several libraries for this; currently the best one available is [**Lunr.js**](http://lunrjs.com/), by Oliver Nightingale. Lunr is, in the words of it's creator "A bit like Solr, but much smaller and not as bright."

Lunr works by taking documents which you have added to its index, and making them searchable. Some algorithms are included behind the scenes to exclude very common words and to reduce related words to a common "stem", providing higher-quality results than just a dumb match would. All of this occurs directly inside the user's browser, so the process is very fast. It could even work off-line if you had an app set up in something like Cordova.

The most simple implementation of Lunr looks like this (taken from the website). First, create an `index` with fields matching the documents you intend to add:

```javascript
var index = lunr(function() {
	this.field('title', {boost: 10});
    this.field('body');
    this.ref('id');
});
```

Next, add "documents" to the Index – these are JSON representations of the content of your site. I'll describe my method for generating such an index later in this post.

```javascript
index.add({
	id: 1,
    title: "Foo",
    body: "Foo foo foo!"
});

index.add({
	id: 2,
    title: "Bar",
    body: "Bar bar bar!"
});
```

Documents can be added either one by one, or all at once as a JSON array of objects.





