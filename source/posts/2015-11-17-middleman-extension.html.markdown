---
title: Writing a Middleman Extension
date: November 17, 2015
header: bg-olive white
layout: page
---
This is a basic example of how a [Middleman extension][1] can programatically
create a PDF version of a static website. I had always assumed that writing an
extension for Middleman would be fairly complicated, but the process was
surprisingly straight-forward and only took a few hours.

## Overview
This extension is a short program that does the following:

- Creates an alternate version of site pages that rely heaviliy on interactive
  elements, replacing them with content that will translate well into print.
- Organizes all content for the print version of the website into a list, while
  preserving the desired order of pages
- Feeds that list to the [Prince PDF generator][3] to convert a single PDF.

## Development Process
Middleman's [extension documentation][2] includes discussion of several different
**callbacks**. I wasn't sure what actions needed to go where, so I relied on
good-old trial and error to get a sense of which methods and objects were available
at any given moment in the program's lifecycle. Some points worth remembering:

- Many of the methods accessible in a `config.rb` file can be called via an `app`
  variable after an extension has been initialized. For example, the `proxy` method
  is available as `app.proxy`. Site-wide `data` objects are also available in the
  `after_configuration` callback and onward.
- The `sitemap` is a very powerful tool. One pattern which I kept re-using was
  this one:

  ~~~ ruby
  resources.find_all { |p| p.some_filter_criteria }
  ~~~

  By passing a code block to the `find_all` method here, you can create a test
  for virtually anything; the results will be a collection of all elements which
  passed the test. The other `Enumerable` methods like `sort_by`, `select`, etc.
  can also be used here.

## Requirements
This extension assumes the [Prince PDF generator][3] is
being used (it has the best output of any command-line tool by far). However,
you could swap out the command in the `after_build` callback to use any other
program which can take a list of files as input.

Creating a [good print stylesheet][4] is also highly recommended.

## Usage
First, you must `require` the extension in `config.rb`. Default place for it to
live is in `extensions/`. Then, define a template for the printed versions of
any dynamic pages (this setup assumes that dynamic pages are being used, and
that the data lives in `data/catalogue/`). Using a separte template means
that interactive elements can be replaced with things that make sense in a
printed format (plain `img` elements instead of dynamic JS-enhanced versions, etc).

The extension will automatically run when the `middleman build` command is given,
and a PDF will appear in the `/pdf` folder when generation is complete.

<script src="https://gist.github.com/egardner/e6f8cb683c5dc50132de.js"></script>

[1]: https://middlemanapp.com/advanced/custom_extensions/
[2]: https://middlemanapp.com/advanced/custom_extensions/#callbacks
[2]: http://www.princexml.com/
[3]: http://alistapart.com/article/building-books-with-css3
