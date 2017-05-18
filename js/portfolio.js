$(document).ready(function(){
  $('.slick-wrapper').slick({
    prevArrow: "#prev-arrow",
    nextArrow: "#next-arrow",
    infinite: true,
    speed:600,
    slidesToShow: 1,
    centerPadding: "5%",
    centerMode: true,
    variableWidth: true,
  });

$('.nav-arrow').click(function() {
  var currentIndex = $('.slick-current').attr('data-slick-index');
  
  console.log("current " + currentIndex);
  switch(currentIndex) {
    case '0': 
      $('#open-link').attr("href", "http://www.myownfeed.com/");
      $('#open-button').html("Open");
      $('#open-button').attr("disabled", false);
      break;
    case '1': 
      $('#open-link').attr("href", "#");
      $('#open-button').html("Demo");
      $('#open-button').attr("disabled", false);
      break;
    case '2':
      $('#open-link').attr("href", "#");
      $('#open-button').html("Open");
      $('#open-button').attr("disabled", true);
      break;
    case '3':
      $('#open-link').attr("href", "#");
      $('#open-button').html("Open");
      $('#open-button').attr("disabled", true);
      break;
  }
});
  
  $('#open-link').click(function(e) {
  var currentIndex = $('.slick-current').attr('data-slick-index');
  
  console.log("current " + currentIndex);
  if(currentIndex === '1' || currentIndex === '2') {
      e.preventDefault();
  }
});
  
$("#projects-button").click(function() {
    $('html,body').animate({
        scrollTop: $("#projects").offset().top},
        1250, 'swing');
});

(function() {
    'use strict';
    var dialogButton = document.querySelector('.dialog-button');
    var dialog = document.querySelector('#spree-dialog');
    if (! dialog.showModal) {
      dialogPolyfill.registerDialog(dialog);
    }
    dialogButton.addEventListener('click', function() {
    var currentIndex = $('.slick-current').attr('data-slick-index');

    if(currentIndex === '1') {
      dialog.showModal();
    }

    });
    dialog.querySelector('button:not([disabled])')
    .addEventListener('click', function() {
      var url = $('#spree-video').attr('src');
      $('#spree-video').attr('src', '');
      $('#spree-video').attr('src', url);
      dialog.close();
    });
  }());
  
});
