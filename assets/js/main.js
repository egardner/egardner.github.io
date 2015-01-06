---
layout: null
library: jquery-2.1.3.min.js
---
// If using a JS framework, include it here
{% include_relative _lib/{{page.library}} %}

// Application code goes here
$(document).ready(function(){
  $('.js-menu-trigger').on('click touchstart', function(e){
    $('.js-menu').toggleClass('is-visible');
    $('.js-menu-screen').toggleClass('is-visible');
    e.preventDefault();
  });

  $('.js-menu-screen').on('click touchstart', function(e){
    $('.js-menu').toggleClass('is-visible');
    $('.js-menu-screen').toggleClass('is-visible');
    e.preventDefault();
  });
});


// Vanilla JS equivalent of $(document).ready
//document.addEventListener('DOMContentLoaded', function(){
//
//});