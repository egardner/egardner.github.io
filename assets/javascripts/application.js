---
layout: null
---
{% include_relative vendor/jquery.min.js %}
{% include_relative vendor/jquery.smoothState.js %}
{% include_relative vendor/slick.min.js %}
{% include_relative vendor/featherlight.min.js %}
{% include_relative vendor/jquery.vide.min.js %}

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
  if ($('.page-cover-slideshow').length) {
    return $('.page-cover-slideshow').slick({
      autoplay: true,
      autoplaySpeed: 6000,
      arrows: false,
      mobileFirst: true,
      pauseOnHover: false,
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
  $('#video').vide({
    mp4: "/assets/video/redsky.mp4",
    webm: "/assets/video/redsky.webm",
    ogv: "/assets/video/redsky.ogv",
    poster: "/assets/video/redsky.jpg"
  });
});