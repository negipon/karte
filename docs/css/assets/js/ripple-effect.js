$.fn.rippleEffect=function(){function t(t){if("touchstart"===t.type)r=!0;else if(r)return void(r=!1);var e=$(this),i=t.originalEvent,p=i.touches?i.touches[0].pageX:t.pageX,a=i.touches?i.touches[0].pageY:t.pageY,o=e.offset(),c=parseInt(p-o.left),n=parseInt(a-o.top),l=e.find("svg");if(0!==l.length){var s=l.data("ripple");s&&(s.stop(),l.data("ripple",null)),l.remove()}e.append('<svg class="fn-ripple"><circle fill-opacity="0.8" cx="'+c+'" cy="'+n+'" radius="0"></circle></svg>');var f=e.find("circle"),u=$({r:.8,op:1}).animate({r:e.outerWidth(),op:1},{easing:"swing",duration:250,step:function(t,e){"op"===e.prop?f.attr("fill-opacity",t):f.attr(e.prop,t)}});f.data("ripple",u)}function e(t){var e=$(this),i=e.find("svg.fn-ripple");if($circle=i.find("circle"),0!==$circle.length){{var r=$circle.data("ripple");parseInt($circle.attr("r"))}r.stop(!0,!1).animate({r:e.outerWidth(),op:0},{easing:"swing",duration:250,step:function(t,e){"op"===e.prop?$circle.attr("fill-opacity",t):$circle.attr(e.prop,t)},complete:function(){i.remove()}})}}var i=$(this);i.css({tapHighlightColor:"rgba(0,0,0,0)"});var r=!1;i.on("mousedown touchstart",t),i.on("mouseup touchend",e)};