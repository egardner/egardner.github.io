# laurelbybee.com Portfolio site

Jekyll site for Laurel Bybee’s online portfolio.

## Local Development

To preview the site locally, open the project in Terminal and run:

```
jekyll server
```

Then you can view the site at `localhost:4000`. 

## Dependencies
- jQuery 2.1.3 (included in repo)
- Normalize.scss (included in repo)
- Bourbon and Neat (install before using)

### Installation
```shell
# in project root
bundle install

# in assets/styles/lib
bourbon install
neat install
```


JS compiles into a single `main.js` file (using Jekyll's new `include_relative` tag). SCSS compiles into `main.css` (note that source files require YAML front-matter in both cases).

## Webfonts
Webfonts should be added into the `assets/fonts` directory. Jekyll does not process Sass partials inside the `_scss` folder. In order to avoid hard-coding font URLs (since no `{{site.baseurl}}` is allowed), `@font-face` declarations should happen in the `assets/styles/fonts.scss` file instead. This is imported before all other styles and should only include `@font-face` declarations. 
If no webfonts are being used (or if you are relying on a CDN), this CSS file and the corresponding link can be removed.





