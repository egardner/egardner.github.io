---
title: How I built this Site
---
{% raw %}

Roadmap and notes for article series on site configuration.

## Things to include:

- Jekyll and static site generation overview
- ~~Bourbon, Neat, and Bitters for baseline~~
- ~~Asset management and file structure~~
- Typographic scale (modular scale)
- Git for version control
- GH Pages deployment
- Lack of complex build tools (yeoman, grunt, gulp, etc.) in favor of simple workflow.
- Fonts in use
- Optimization as part of design process
- `_data` for navigation?
- Custom collections (`projects`)
- Markdown engines (Redcarpet vs Kramdown)
- Better typography through SmartyPants extension
- Code syntax highlighting (Redcarpet Markdown vs Jekyll liquid tags; custom theme)

---

## Data-driven navigation
One of the best-practices approaches I'm trying to implement is a data-driven navigation. The idea is to separate the data of how the site is organized from the nav markup. In terms of code, navigation is often one of the most complex features on a site. Digging into a dense thicket of code just to add a new menu item can quickly become a nightmare, so I want to use a more elegant and automated solution.  

This site's data-driven navigation is a work in progress, based on [Dale Tournemille's tutorial](http://www.tournemille.com/blog/How-to-create-data-driven-navigation-in-Jekyll/).

---

## Collections
In `config.yml` the `permalinks` option can be set to a specified path. For "Projects" this is specified as follows:

```yaml
collections:
  projects:
    output: true
    permalink: /projects/:path/
```

To create a top-level "Projects" page, there is a `projects.md` file in the root directory. This page needs to have a `permalink` defined manually, since it does not exist inside the `_projects` folder. YAML front-matter goes as follows:

```yaml
---
title: Projects
layout: default
Permalink: /projects/
---
```

---

#### Open Questions:
- Is it possible to define a custom output directory for blog posts?

#### Future things to add:

- Prose.io integration

{% endraw %}
