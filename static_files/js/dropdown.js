$(document).ready(function() {
  
   $(".selLabel").click(function () {
     $('.dropdown').toggleClass('active');
   });
   
   $(".dropdown-list li").click(function() {
     $('.selLabel').text($(this).text());
     $('.dropdown').removeClass('active');
     $('.selected-item p span').text($('.selLabel').text());
   });
   
 });