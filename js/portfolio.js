$(document).ready(function(){
  $('.slick-wrapper').slick({
    prevArrow: "#prev-arrow",
    nextArrow: "#next-arrow",
    infinite: true,
    speed: 700,
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
      break;
    case '1': 
      $('#open-link').attr("href", "#");
      $('#open-button').html("Demo");
      break; 
  }
});
  
  $('#open-link').click(function(e) {
  var currentIndex = $('.slick-current').attr('data-slick-index');
  
  console.log("current " + currentIndex);
  if(currentIndex === '1') {
      e.preventDefault();
  }
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

    console.log("current " + currentIndex);
    if(currentIndex === '1') {
      dialog.showModal();
    }

    });
    dialog.querySelector('button:not([disabled])')
    .addEventListener('click', function() {
      dialog.close();
    });
  }());
  
});
