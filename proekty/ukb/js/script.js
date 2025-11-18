//Cлайдер

$(document).ready(function() {
 $(".slider").each(function () {  
  var obj = $(this);
  $(obj).append("<div class='nav'></div>");
  $(obj).find("li").each(function () {
   $(obj).find(".nav").append("<span rel='"+$(this).index()+"'></span>");  
   $(this).addClass("slider"+$(this).index());
  });
  $(obj).find("span").first().addClass("on");  
 });
});
function sliderJS (obj, sl) {  
 var ul = $(sl).find("ul");  
 var bl = $(sl).find("li.slider"+obj);  
 var step = $(bl).width();  
 $(ul).animate({marginLeft: "-"+step*obj}, 500);  
}
$(document).on("click", ".slider .nav span", function() {  
 var sl = $(this).closest(".slider");  
 $(sl).find("span").removeClass("on"); 
 $(this).addClass("on");  
 var obj = $(this).attr("rel");  
 sliderJS(obj, sl); 
 return false;
});

//Меню контент

(function($) {
$(function() {

  $('ul.tabs_caption').on('click', 'li:not(.active)', function() {
    $(this)
      .addClass('active').siblings().removeClass('active')
      .closest('div.tabs').find('div.tabs_content').removeClass('active').eq($(this).index()).addClass('active');
  });

});
})(jQuery);

// Слайдер в сайдбаре
$(function(){
    
  $('.sidebar_slider').each(function(){
    var box = $(this);
    var slider = box.simpslider({
      itemsSelector: '.item',
      autoStart: false,
      infinit: false,
      speed: 600
    });
  });
  
  // Фильтр
  (function(){
    var box = $('.departments');
    if( !box.length ) return;
    var btns = box.find('.row div'),
      drops = box.find('.drop');
    btns.click(function(){
      var btn = $(this);
      btns.not(btn).removeClass('active');
      btn.toggleClass('active');
      drops.removeClass('active');
      var drop = btn.parent().next('.drops').find('.drop').eq(btn.index()).toggleClass('active', btn.hasClass('active') );
    });
  })();
  
   
  
});

 