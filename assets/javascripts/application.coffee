---
layout: null
---


# Helper Functions ------------------------------------------
getRandomImage = ($arrayElement) ->
  coverImages = []
  $arrayElement.each ->
    image = {}
    image.url = $(this).data("cover-image")
    image.desc = $(this).data("cover-desc")
    coverImages.push image
  return coverImages[Math.floor(Math.random() * coverImages.length)].url

changeBackground = ($el, imageURL) ->
  $($el).css("background-image", "url('#{imageURL}')")

slickSetup =  ->
  if $('.project-gallery').length
    $('.project-gallery').slick
      autoplay: true,
      autoplaySpeed: 5000,
      arrows: true,
      mobileFirst: true,
      pauseOnHover: true,
      prevArrow: '<i class="ion-chevron-left slick-prev"></i>',
      nextArrow: '<i class="ion-chevron-right slick-next"></i>'



# Document Ready --------------------------------------------

$(document).ready ->

  # Cover page only
  if $("#cover-list").length
    $cover = $("#cover")
    $collection = $("#cover-list li")
    randomImage = getRandomImage($collection)
    changeBackground($cover, randomImage)

    # setInterval ->
    #   changeBackground($cover, getRandomImage($collection))
    # , 5000

  slickSetup()
  hljs.initHighlightingOnLoad()

  $("#main").smoothState({blacklist: '.no-smoothState'})
