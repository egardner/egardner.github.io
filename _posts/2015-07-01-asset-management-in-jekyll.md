---
title: Jekyll Asset Management
published: true
---

{% raw %}

> _This post is the first in a series discussing the ins and outs of building this website._

### Asset Management for the Grunt-Averse

Without a doubt, the biggest challenge in building this site was figuring out how to deal with assets.

In the last few years, the number of tools available to front-end developers has exploded. Modern web development means using CSS preprocessors, template engines, script concatenators, image optimizers, auto-prefixers, the list goes on. Then of course you need tools to build all the other tools into a coherent website: tools like [Grunt](http://gruntjs.com/), [Gulp](http://gulpjs.com/), [Yeoman](http://yeoman.io/), [Bower](http://bower.io/). Suddenly your minimal project is full of config files and component folders, with dependencies in three different languages.

_This is not what I signed up for._

---

### Tools of choice

I'm a big fan of the [Bourbon](http://bourbon.io) front-end framework, which I think hits the sweet spot between light weight and rich features. The accompanying grid system [Neat](http://neat.bourbon.io) has the added bonus of leaving your markup completely free of non-semantic
classes like `grid-col-4-med-2` (yuck!).

In the Rails world, developers are spoiled by an asset pipeline that automatically handles fonts, images, and JS/CSS libraries. Someone has actually ported this feature to Jekyll as a plugin, [jekyll-assets](https://github.com/ixti/jekyll-assets).  

While this would certainly be the easiest way to handle assets, there is a catch. One of Jekyll's biggest advantages is the fact that you can run it on [Github Pages](https://help.github.com/articles/using-jekyll-with-pages/). The problem is that GitHub Pages removes support for all but a handful of plugins. So while the tools exist to setup a modern asset pipeline in Jekyll, if you want to use GitHub for deployment you are stuck trying to re-build this functionality yourself.  

Many developers would use [Grunt](http://gruntjs.com/) or [Gulp](http://gulpjs.com/) to bridge this gap. However, introducing these tools adds some additional overhead in terms of maintenance and dependencies. After some experimentation, I found that I could accomplish everything I needed through Jekyll's built-in functionality with the right setup.

In what follows I'm going to outline the steps I took to organize assets using only Jekyll's built-in tools.

---
### 1. File Structure

I prefer to work with a clearly-defined `assets` directory where all styles, fonts, and scripts live. This directory (which lives in the root of the project) is organized as follows:

```bash
assets
├── fonts
├── images
├── javascripts
│   ├── vendor
│   └── application.js
└── stylesheets
    ├── base
    ├── components
    ├── vendor
    └── application.scss
```

Jekyll works by copying all files inside the root folder, processing them where appropriate (as indicated by YAML front-matter beginning and ending with `---`), and outputting them to the `_site` folder. Any files or folders beginning with an underscore are excluded from this process.

In this setup, all component SCSS and JS lives inside of underscore-prefixed directories (`stylesheets` and `vendor`, respectively). This means that only compiled code will be copied to the production site.

---
### 2. Sass

Jekyll processes Sass the way it handles all other files. This means that any Sass files beginning with YAML front matter (even just two lines of `---` at the start of the file) will be "transformed" into a CSS file of the same name. So `application.scss` becomes `application.css` when it is copied into the `_site` folder.

One exception to this is how Sass partials are handled. Jekyll recongizes a special directory for Sass partials. All files in the partials directory are ignored by Jekyll except for resolving `@import` directives. Stylesheets from a 3rd-party framework like Bourbon or Bootstrap can live here without bloating up the final site; the final `application.css` file will be a single, minified stylesheet that contains all necessary code, eliminating extra HTTP requests and speeding up load time.

By default Jekyll looks for Sass partials in the folder `_sass` in the project root. I want to change that so I can keep all my stylesheet files inside of my `assets` directory, so first I need to tell Jekyll where to look for Sass imports by updating the site's `_config.yml` file:

```ruby
# Assets
#==================================
sass:
  sass_dir: assets/stylesheets  # default is _sass
  style: compressed  # set to compressed for production
```

The `stylesheets` directory looks like this:

```bash
assets/stylesheets
├── _layout.scss
├── base
└── vendor
    ├── _normalize.scss
    ├── bourbon
    └── neat
```

Inside the `stylesheets` folder, I've created a directory called `vendor`. Inside this directory, I run:

```bash
# assets/stylesheets/vendor
bourbon install
neat install
```

I'm also copying a sass version of the Normalize stylesheet here.  

The `base` directory is used for [Bitters defaults](http://bitters.bourbon.io). These files will be heavily modified to serve my purposes, unlike the contents of the `vendor` folder which serve as my framework. I do this by running `bitters install` at the root of the `stylesheets` directory.  

Finally, I need to import everything in my `application.scss` file. The beginning of this file looks like this (note the dashes for YAML front-matter---these are required here):

```sass
---
---
/* Bourbon, Bitters, & Neat
 * ---------------------------------------------------------------------------*/
@import "vendor/normalize";
@import "vendor/bourbon/bourbon";
@import "base/grid-settings";
@import "vendor/neat/neat";
```

---
### 3. Fonts

Web design is 95% typography, so using good typefaces is essential. There are a lot of sources for free and non-free webfonts of excellent quality, and one of the easiest ways to load webfonts is through a CDN, by way of a `<link>` tag in the HTML head of your pages.

I prefer to serve webfonts directly from my own server, mainly because I hate seeing the "flash of unstyled text" (FOUT) that can appear while a page is loading fonts from a remote source. This means dealing with a lot of `@font-face` declarations.

Fortunatlely, Bourbon includes a `@font-face` [shorthand](http://bourbon.io/docs/#font-face) which makes this process a lot less painful.

Font declarations can live inside their own stylesheet (`_fonts.scss` in my case). But there's one important trick to be aware of: **variables pointing to the font locations must be declared in the application.scss file**

```sass
//application.scss
---
---
$image-dir: "{{site.baseurl}}/assets/images";
$fonts-dir: "{{site.baseurl}}/assets/fonts";
```

The final location of font files is always going to be relative to `{{site.baseurl}}`. By declaring them inside the main stylesheet where we can use Jekyll's site-wide variables, we will always reference the correct location.

I'm using the same trick for images, btw.

Now when we import the Fonts stylesheet, we can rely on variable interpolation to make sure we always point to the right font locations:

```sass
//@import "fonts";
@include font-face("Franklin Gothic", "#{$fonts-dir}/FranklinGothic-Book-webfont", 400);
@include font-face("Franklin Gothic", "#{$fonts-dir}/FranklinGothic-Demi-webfont", 600);

@include font-face("Franklin Gothic", "#{$fonts-dir}/FranklinGothic-Bookit-webfont", 400, italic);
@include font-face("Franklin Gothic", "#{$fonts-dir}/FranklinGothic-Demiit-webfont", 600, italic);

```

After this I import the Bitters defaults, and then any other layout-specific or page-specific styles.

```sass
/* Globals
 * ---------------------------------------------------------------------------*/
@import "base/base";

/* Layouts
 * ---------------------------------------------------------------------------*/
@import "layout";
```
---
### 4. JavaScript

To cut down on HTTP requests, I'm compiling all scripts into a single `application.js` file, similar to the way Sass is handled. Jekyll does not currently support a simple way to define a site-wide plugin directory the way it can handle Sass partials. However, as of version 2.4, Jekyll supports an `include_relative` tag ([docs here](http://jekyllrb.com/docs/templates/#including-files-relative-to-another-file)), which allows library files to be included without having to be copied to the production site.

Here's what the `javascripts` directory looks like with jQuery included as a library:

```bash
assets/javascripts
├── vendor
│   └── jquery.min.js
└── application.js
```

The `application.js` file calls jQuery via `include_relative`:

```javascript
---
layout: null
---

{% include_relative vendor/jquery.min.js %}

$(document).ready(function() {
    // code goes here
});
```

Like `application.scss`, this file must begin with YAML front-matter, even if nothing exists between the dashes. I decided to create a `library` variable to make it easier to swap in different versions of jQuery (or to replace it with something like Zepto).  

Files in the `vendor` folder do not get any YAML treatment---they can be left alone. I've named this folder with an underscore, so it will not be copied into the production site. Additional `include_relative` tags can be added in the order that files should be loaded.

At some point in the future, Jekyll may support more Grunt-like functionality, such as concatenation and minification of JS files based on a source directory specified in the site's `config.yml` file. For a simple site I am willing to live without these features---most of the libraries I'm loading will be minified to begin with, and concatenation is handled by using `include_relative` tags.

One final point to consider---are JS libraries and frameworks even necessary in the first place? [You Might Not Need jQuery](http://youmightnotneedjquery.com/) is an excellent resource for vanilla JS alternatives to common jQuery scripts. For example, a vanilla JS replacement for `$(document).ready` is:

```javascript
// Vanilla JS $(document).ready
document.addEventListener('DOMContentLoaded', function(){

});
```
---
### 5. Version Control

One final point: **Commit all dependencies to source**---this is a no-no in some circles, but since this site is being deployed via GitHub Pages, everything needed to generate it (including various vendor files) must be committed to the source repo. I know this sounds obvious but I made this mistake myself when first getting started here.

{% endraw %}
