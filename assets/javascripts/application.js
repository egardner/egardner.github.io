---
layout: null
---
{% include_relative vendor/jquery.min.js %}
{% include_relative vendor/jquery.smoothState.js %}
{% include_relative vendor/slick.min.js %}
{% include_relative vendor/underscore-min.js %}
{% include_relative vendor/photoswipe.min.js %}
{% include_relative vendor/photoswipe-ui-default.min.js %}
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

function lightBox(index) {
  var pswpElement = document.querySelectorAll(".pswp")[0];

  // build items array
  var slides  = [];
  var figures = document.querySelectorAll(".masonry-item");
  var options = {
    index: index,
    clickToCloseNonZoomable: false
  };

  // document query selector returns an HTMLCollection, not a true array
  // So we need to proxy a true Array object to get forEach
  [].forEach.call(figures, function(figure) {
    var slide   = {};
    slide.src   = figure.querySelector("img").src;
    slide.w     = figure.querySelector("img").naturalWidth;
    slide.h     = figure.querySelector("img").naturalHeight;
    // slide.title = figure.querySelector("figCaption").textContent;
    slides.push(slide);
  });

  // init gallery
  var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, slides, options);
  gallery.init();
}

function lightBoxSetup() {
  if ($(".masonry-item")) {
    $figures = $(".masonry-item img");
    $figures.on("click", function(e) {
      var figs = document.querySelectorAll(".masonry-item");
      var target = _.findIndex(figs, function(figure) {
        return figure.id == e.target.parentNode.id;
      });

      console.log(target);
      lightBox(target);
    });
  }
}


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
  lightBoxSetup();
  $('#video').vide({
    mp4: "/assets/video/redsky.mp4",
    webm: "/assets/video/redsky.webm",
    ogv: "/assets/video/redsky.ogv",
    poster: "/assets/video/redsky.jpg"
  });
});
