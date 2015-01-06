---
title: How I built this Site
---

## Things to include:

- Jekyll and static site generation
- Bourbon, Neat, and Bitters for baseline
- Typographic scale (modular scale)
- Git for version control
- GH Pages deployment
- Lack of complex build tools (yeoman, grunt, gulp, etc.) in favor of simple workflow.
- Fonts in use
- Optimization as part of design process
- _data for navigation?
- Custom collections (projects)

---
#### Assets

Without a doubt, the biggest stumbling block in getting this site off the ground
was figuring out how to best handle assets.  

I'm a big fan of the [Bourbon](http://bourbon.io) front-end framework, which I
think hits the sweet spot between minimalism and bloat in terms of features. 
Bootstrap and Foundation are great, but for most small projects I consider them 
to be overkill. And [Neat](http://neat.bourbon.io), the grid-system plug-in for
Bourbon, has the added bonus of leaving your markup completely free of non-semantic
classes like `grid-col-4-med-2` and the like (yuck!).

In Rails and related platforms (Middleman, Sinatra, etc.), there are a number 
of tools to set up an "asset pipeline," where libraries for styles and scripts 
can just be required as a gem and then forgotten about.  

Someone has actually ported this feature to Jekyll as a plugin, 
[jekyll-assets](https://github.com/ixti/jekyll-assets). This is certainly the most
rational way to handle all the myriad fonts, frameworks, js libraries, etc. that
are required for building modern websites.  

Unfortunately, there is a catch. One of Jekyll's biggest advantages is the fact
that you can run it on [Github Pages](https://help.github.com/articles/using-jekyll-with-pages/). The problem is that GH Pages removes support for all but a handful of plugins. 
So while the tools exist to setup a modern asset pipeline in Jekyll, if you want 
to use GitHub for deployment you are stuck trying to re-build this functionality 
yourself.  

Many developers would use a tool like Grunt or Gulp to bridge this gap. However,
introducing these tools adds some additional overhead in terms of maintenance and
dependencies to keep track of. After some experimentation, I found that I could 
accomplish everything I needed through Jekyll's built-in functionality – provided
that things were properly set up.

##### 1. File Structure

I prefer to work with a clearly-defined `assets` directory where all styles, fonts, 
and scripts live. This directory is organized as follows:

```
assets
├── fonts
├── img
├── js
│   └── _lib
│   └── main.js
└── styles
    └── _scss
    └── main.scss
```

Jekyll works by copying all files inside the project folder, processing them where
appropriate (as indicated by YAML front-matter beginning and ending with `---`), 
and outputting them to the `_site` folder. Any files or folders beginning 
with an underscore are excluded from this process.

In this site, all component SCSS and JS lives inside of underscore-prefixed 
directories (`_scss` and `_lib`, respectively). 

##### 2. Sass 

Jekyll handles Sass the way it handles all other files. This means that any sass
files beginning with YAML front matter (even just two lines of `---` at the start
of the file) will be converted to a css file of the same name. So `main.scss` 
becomes `main.css` when it is copied into the `_site` folder.

One exception to this is how Sass partials are handled. When Jekyll converts a 
Sass file, it will look for any partials called by `@import` in a special Sass
directory. By default this is `_sass` in the project root. I want to change that 
so I can keep all my stylesheet files inside of my `assets` directory, 
so first we need to tell Jekyll where to look for Sass imports by updating the 
site's `_config.yml` file:

```yaml
# Assets
#==================================
sass:
  sass_dir: assets/styles/_scss  # default is _sass
  style: compressed  # set to compressed for production
```

Jekyll ignores the `sass_dir` for all purposes except resolving `@import` directives.
All vendor/library stylesheets can live here without bloating up the final site.
The production site's `main.css` file will be a single, minified stylesheet that
contains everything, eliminating extra HTTP requests and speeding up load time. 

The `_scss` directory looks like this:

```
assets/styles/_scss
├── _layout.scss
├── base
└── lib
    ├── _normalize.scss
    ├── bourbon
    └── neat
```

Bourbon and Neat are installed to the `lib` subdirectory, along with a sass 
version of the Normalize stylesheet. The `base` directory is used for Bitters 
defaults ([bitters.bourbon.io](http://bitters.bourbon.io)). These files will be 
heavily modified to serve my purposes, unlike the contents of the `libs` folder
which serve as my framework.

My `main.scss` file starts out like this:

```scss
---
---
/* Bourbon, Bitters, & Neat
 * ---------------------------------------------------------------------------*/
@import "lib/normalize";
@import "lib/bourbon/bourbon";
@import "base/grid-settings";
@import "lib/neat/neat";
```

##### 3. Fonts

Web design is 95% typography, so using good typefaces is essential. There
are a lot of sources for free and non-free web-fonts of excellent quality, and 
one of the easiest ways to load webfonts is through a CDN, by way of a `<link>`
tag in the HTML head of your pages.

I prefer to serve webfonts directly from my own server, mainly because I hate 
seeing the "flash of unstyled text" (FOUT) that can appear while a page is loading
fonts from a remote source. This means dealing with a lot of `@font-face` declarations.

Fortunatlely, Bourbon includes a `@font-face` [shorthand](http://bourbon.io/docs/#font-face)
which makes this process a lot less painful.

**Fonts must be declared in the main.scss file** – there is no way around this in
the current setup. This is because I'm relying on both a Bourbon mixin as well as
Jekyll's `{{site.baseurl}}` variable to be able to use a relative asset path to 
my `fonts` directory – so Jekyll needs to be aware of the file I'm making my 
font declarations in.

Ideally the `main.scss` file would consist of nothing but `@import`s. Unfortunately,
this is a compromise forced by the lack of more robust asset handling in Jekyll.
But once figured out the solution is pretty straightforward.

After importing the libraries at the top of `main.scss`, the next thing I need to
do is load all necessary fonts:

```scss
/* Fonts
 * ---------------------------------------------------------------------------*/
// Merriweather
@include font-face("Merriweather", '{{site.baseurl}}/assets/fonts/merriweather-light', normal);
@include font-face("Merriweather", '{{site.baseurl}}/assets/fonts/merriweather-lightitalic', normal, italic);
@include font-face("Merriweather", '{{site.baseurl}}/assets/fonts/merriweather-bold', bold);
@include font-face("Merriweather", '{{site.baseurl}}/assets/fonts/merriweather-bolditalic', bold, italic);
// Lato
@include font-face("Lato", '{{site.baseurl}}/assets/fonts/lato-light', normal);
@include font-face("Lato", '{{site.baseurl}}/assets/fonts/lato-lightitalic', normal, italic);
@include font-face("Lato", '{{site.baseurl}}/assets/fonts/lato-black', bold);
@include font-face("Lato", '{{site.baseurl}}/assets/fonts/lato-blackitalic', bold, italic);
// League Spartan
@include font-face("League Spartan", '{{site.baseurl}}/assets/fonts/leaguespartan-bold', bold);

```

After this I import the Bitters defaults, and then any other layout-specific or 
page-specific styles.

```scss
/* Globals
 * ---------------------------------------------------------------------------*/
@import "base/base";

/* Layouts
 * ---------------------------------------------------------------------------*/
@import "layout";
```

##### 4. JavaScript

To cut down on HTTP requests, I'm compiling all scripts into a single `main.js`
file, similar to the way Sass is handled. Jekyll does not currently support a
simple way to define a site-wide plugin directory the way it can handle Sass partials.
However, as of version 2.4, Jekyll supports an `include_relative` tag ([docs here](http://jekyllrb.com/docs/templates/#including-files-relative-to-another-file)), which 
allows library files to be included without having to be copied to the production site.

Here's what the `js` directory looks like with jQuery included as a library:

```
assets/js
├── _lib
│   └── jquery-2.1.3.min.js
└── main.js
```

The `main.js` file calls jQuery via `include_relative`:

```javascript
---
library: jquery-2.1.3.min.js
---
{% raw %}
{% include_relative _lib/{{page.library}} %}
{% endraw %}
$(document).ready(function() {
    // code goes here
});
```

Like `main.scss`, this file must begin with the YAML front-matter, even if nothing
exists between the dashes. I decided to create a `library` variable to make it 
easier to swap in different versions of jQuery (or easily replace with something 
else).  

Files in the `_libs` folder do not get any YAML treatment – they can be left alone.
This folder begins with an underscore, so it will not be copied into the production
site (which is good since it's not needed there). Additional `include_relative`
tags can be added in the order that files should be loaded.

At some point in the future, Jekyll may support more Grunt-like functionality like
concatenation and minification of JS files, based on a source directory specified
in the site's `config.yml` file. For a simple site I am willing to live without
these features – most of the libraries I'm loading will be minified to begin with,
and concatenation is handled by using `include_relative` tags.

One final point to consider – are JS libraries and frameworks even necessary in 
the first place? [You Might Not Need jQuery](http://youmightnotneedjquery.com/)
is an excellent resource for vanilla JS alternatives to common jQuery scripts.
For example, a vanilla JS replacement for `$(document).ready` is:
```javascript
// Vanilla JS $(document).ready
document.addEventListener('DOMContentLoaded', function(){

});
```

---

#### Data-driven navigation
One of the best-practices approaches I'm trying to implement is a data-driven
navigation. The idea is to separate the data of how the site is organized from 
the nav markup. In terms of code, navigation is often one of the most complex 
features on a site. Digging into a dense thicket of code just to add a new menu 
item can quickly become a nightmare, so I want to use a more elegant and 
automated solution.  

This site's data-driven navigation is a work in progress, based on
[Dale Tournemille's tutorial](http://www.tournemille.com/blog/How-to-create-data-driven-navigation-in-Jekyll/).


#### Collections + pretty permalinks
In `config.yml` the `permalinks` option can be set to a specified path.
For "Projects" this is specified as follows:

```yaml
collections:
  projects:
    output: true
    permalink: /projects/:path/
```
To create a top-level "Projects" page, there is a `projects.md` file in the root
directory. This page needs to have a `permalink` defined manually, since it does
not exist inside the `_projects` folder. YAML front-matter goes as follows:
```yaml
---
title: Projects
layout: default
Permalink: /projects/
---
```

#### Open Questions:
- Is it possible to define a custom output directory for blog posts?

#### Future things to add:

- Prose.io integration