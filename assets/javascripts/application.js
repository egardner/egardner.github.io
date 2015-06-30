---
layout: null
---
{% include_relative vendor/jquery.min.js %}
{% include_relative vendor/highlight.pack.js %}
{% include_relative vendor/jquery.smoothState.js %}
{% include_relative vendor/slick.min.js %}

// Helper Functions
var changeBackground, getRandomImage, slickSetup;

getRandomImage = function($arrayElement) {
  var coverImages;
  coverImages = [];
  $arrayElement.each(function() {
    var image;
    image = {};
    image.url = $(this).data("cover-image");
    image.desc = $(this).data("cover-desc");
    return coverImages.push(image);
  });
  return coverImages[Math.floor(Math.random() * coverImages.length)].url;
};

changeBackground = function($el, imageURL) {
  return $el.css("background-image", "url('" + imageURL + "')");
};

slickSetup = function() {
  if ($('.project-gallery').length) {
    return $('.project-gallery').slick({
      autoplay: true,
      autoplaySpeed: 5000,
      arrows: true,
      mobileFirst: true,
      pauseOnHover: true,
      prevArrow: '<i class="ion-chevron-left slick-prev"></i>',
      nextArrow: '<i class="ion-chevron-right slick-next"></i>'
    });
  }
};

// Initialization

$(document).ready(function() {
  var $collection, $cover, randomImage;
  if ($("#cover-list").length) {
    $cover = $("#cover");
    $collection = $("#cover-list li");
    randomImage = getRandomImage($collection);
    changeBackground($cover, randomImage);
  }
  slickSetup();
  hljs.initHighlightingOnLoad();
  return $("#main").smoothState({
    blacklist: '.no-smoothState'
  });
});