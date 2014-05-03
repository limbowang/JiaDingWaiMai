/**
 * Created by Limbo on 2014/5/2.
 */

$(document).ready(function () {
  // for sidebar scrolling
  (function () {
    var lastY = 0;
    $('.sidebar-content')
      .on('touchmove', function (e) {
        e.preventDefault();
        e = e.originalEvent;
        var changesTouches = e.targetTouches;
        if (changesTouches.length == 1) {
          var touch = changesTouches[0];
          var deltaY = 0;
          if (lastY == 0) {
            lastY = touch.screenY;
          } else {
            var sidebarList = $(this).find('.sidebar-list');
            var top = parseInt(sidebarList.css('top').replace('px', ''));
            deltaY = touch.screenY - lastY;
            if (deltaY > 1) {
              deltaY = 8
            } else if (deltaY < -1) {
              deltaY = -8
            } else {
              deltaY = 0
            }
            lastY = touch.screenY;
            console.log(sidebarList.height() + top - deltaY < $(this).height());
            if (!(deltaY > 0 && top >= 0) && !(deltaY < 0 && sidebarList.height() + top - deltaY < $(this).height()))
              sidebarList.css('top', top + deltaY);
          }
        } else if (changesTouches.length > 1) {
          lastY = 0;
        }
      })
      .on('touchend', function(e) {
        lastY = 0;
      });
  }())
});