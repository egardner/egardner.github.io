require "extensions/views"

activate :blog do |blog|
  blog.name = "posts"
  blog.prefix = "posts"
  blog.layout = "page"
  blog.permalink = "/{year}/{title}.html"
end

activate :blog do |blog|
  blog.name = "projects"
  blog.prefix = "projects"
  blog.permalink = "{title}.html"
end

page "/projects/*", :layout => "media"

activate :views
activate :directory_indexes
activate :autoprefixer
activate :syntax

set :markdown_engine, :kramdown
set :markdown,        :parse_block_html => true,
                      :smart_quotes => ["lsquo", "rsquo", "ldquo", "rdquo"]
set :haml,            :ugly => true
set :relative_links,  true
set :css_dir,         "assets/stylesheets"
set :js_dir,          "assets/javascripts"
set :images_dir,      "assets/images"
set :fonts_dir,       "assets/fonts"
set :partials_dir,    "partials"
set :layout,          "layouts/application"

configure :development do
 activate :livereload
end

configure :build do
  # Relative assets needed to deploy to Github Pages
  activate :relative_assets
end

activate :deploy do |deploy|
  deploy.build_before = true
  deploy.method = :git
  deploy.branch = 'master' # default: gh-pages
end

helpers do
  def nav_link(link_text, page_url, options = {})
    options[:class] ||= ""
    if current_page.url.length > 1
      current_url = current_page.url.chop
    else
      current_url = current_page.url
    end
    options[:class] << " active" if page_url == current_url
    link_to(link_text, page_url, options)
  end
end
