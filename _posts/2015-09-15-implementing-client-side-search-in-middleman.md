---
layout: article
published: true
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

Search is one feature that used to be a deal-breaker in building a static site. If the user expects to easily search through content at a granular level (an increasingly common expectation), what can you do without a database to query based on their requests?

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

Documents can be added either one by one, or all at once as a JSON array of objects. To search the index once some documents have been added, you just call:

```javascript
index.search("foo");
```

When you run this query, Lunr returns an array of results (in descending order of relevance). Each result object contains a `ref` property which matches the `id` of the matching document, and a `score` value (between 0 and 1) that represents the closeness of the match. The `boost` option seen above will help determine how this score is calculated.

A lot more is possible (just check the [documentation](http://lunrjs.com/docs/) to get a sense), but I was able to get a fully-functioning implementation working without doing much more than what I've just shown here. Lunr is a great example of a library that does one thing and does it very well.

### Generating a JSON Index
So Lunr makes it easy to run a client-side search, but we still need to actually _generate_ the index that it will use to search the site. This means we need to automatically build a JSON version of our content (the content we want to search, anyway) and then feed that into Lunr when necessary.

From Middleman's perspective, this is no different than processing any other template for a static page – we are just compiling the final output as JSON instead of HTML in this particular case. The simplest way to do this is to create a page in the `source` folder called `contents.json.erb`.

Expressed as pseudo-code, here's the logic used to assemble the index:

1. Find all pages that should be included in the search
2. Create an array of index `entries` (empty to begin)
3. Iterate through the array of all pages and...
   - create a blank `entry` hash
   - assign various values to the hash (`:id`, `:title`, `:url`, etc.) and store relevant date from the page
   - Append this hash to the `entries` array and repeat
   - Use Ruby's handy `to_json` method to convert the `entries` array into a properly formatted JSON object.

In my case, I am not using Middleman's blog extension, so I don't have a convenient site-wide collection of `articles` to grab. Instead I'm searching the `sitemap` object to find all resources with a `source_file` in Markdown (all raw text content, in this project). The `contents.json.erb` file looks like this (simplified here):

```erb
# contents.json.erb
<%
pages = sitemap.resources.find_all { |p| p.source_file.match(/\.md/) }
entries = []

pages.each_with_index do |page, index|
	object = {}
    # ... some specifics ommitted
    entry = {
    	:id 	 => index,
        :title	 => page.data.title,
        :url	 => page.url,
        :content => page.render({:layout => false }).gsub( %r{</?[^>]+?>}, '' )
    }
    entries << entry
end
%><%= entries.to_json %>
```

A note on how the `:content` field is populated: Each object in the `pages` array is a `Middleman::Sitemap::Resource` object. The `Resource` object comes with a `render` method, which converts the source file into HTML output. By passing an option of `{:layout => false}` when the method is called, we leave behind all extraneous header/footer/nav elements, etc. To strip down our index even more, a call to `gsub` with a crude regular expression strips out most HTML tags. Since this is just an index, the content doesn't have to be 100% perfect (end users will never see it directly). But this technique helps to remove some clutter before we start running queries.

Now, every time we build our site, `contents.json.erb` becomes `contents.json`, a single JSON file that includes both metadata and full text content for every page that exists. In my case (a large academic book with several lengthy essays), this file came out to about 650KB – similar to the size of a large image.

### Searching in the Browser
Now we have a static JSON index of our site, compiled at build time. To make our site searchable, we need to go through the following steps (again, in pseudocode first):

1. Load the JSON file asynchronously in the background (before the user starts searching)
2. Feed the contents of this file to Lunr to create a searchable index
3. Hang on to a copy of this data to cross-reference our results with (i.e., when Lunr returns a result of `ref: 4`, we need to look up `element[4]` of the site contents to show the user the title/URL of their search result.
4. Present the search results to the user as they type (we'll use a Handlebars template for this).

I'll go through each step in more detail below.

#### 1. Asynchronous Loading
Learning to think asynchronously in Javascript can come with a pretty steep curve. This technique is essential for most sophisticated user interactions, but it can be very counter-intuitive to think this way – especially starting out.

Asynchronous functions can feel a little like time-travel. Before you make an asynchronous function call, you can move in linear order from one statement to the next. Values get assigned in the way you expec them to and are available later on in the program. But once you've made that call, you step into an uncertain future. There is no way to know just how much time will pass until the call returns – meanwhile control continues to flow down the program, oblivious.

When you need to work with data that will not be available until an async request resolves, all subsequent work must be done in a callback function — leave the traditional control flow behind at this point.

The code to load our index looks like this:

```javascript
// various function declarations and set-up 
// has happened already at this point
$.getJSON("/contents.json", function(data) {
	var index = populateIndex(data);
    var contents = contentList(data);
    searchSetup(index, contents);
    // other code for app below - anything that needs search functionality
    // lives inside of this callback
    // ...
});
```

All search-related code happens inside an anonymous callback function after $.getJSON() resolves. The returned `data` is passed around as a parameter into other functions below.

#### 2. Set up the Lunr Index
The first function called inside of our callback sets up a new Lunr index with the contents of `contents.json`. The function which does that looks like this:

```javascript
// Feed data into an empty lunr index and return the populated result
function populateIndex(data) {
  var index = lunr(function(){
    this.field('title', { boost: 10 });
    this.field('content');
    this.ref('id');
  });
  data.forEach(function(item) {
    index.add(item);
  });
  return index;
}
```
Since `data` is a JSON array, we can iterate through it and add each object as a document to the Lunr index. That's it – Lunr takes care of the rest here.

#### 3. Keep a content list to cross-reference results against
The next line in our callback creates a `contents` variable with a `contentList()` function. As mentioned above, Lunr searches only return a `ref` and a `score` – we want to know the actual title, URL, etc. of whatever pages are coming up in the results. So stashing the search data into a `contents` array gives us something to reference.

```javascript
// Create an array of contents to reference our search results against
function contentList(data) {
  var contents = [];
  data.forEach(function(item) {
    contents.push(item);
  });
  return contents;
}
```

#### 4. Present the results to the User



































