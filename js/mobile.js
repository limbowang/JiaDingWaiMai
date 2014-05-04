/**
 * Created by Limbo on 2014/5/2.
 */

$(document).ready(function () {
  // for sidebar scrolling
  (function () {
    var
      lastY = 0,
      sidebar = $('.sidebar'),
      sidebarContent = sidebar.find('.sidebar-content'),
      sidebarList = sidebar.find('.sidebar-list'),
      defaultHeight = sidebar.find('.sidebar-header').height() + sidebar.find('.sidebar-search').height();
    sidebar.on('touchmove', function (e) {
      e.preventDefault();
    });
    sidebarContent
      .on('touchmove', function (e) {
        e = e.originalEvent;
        var changesTouches = e.changedTouches;
        if (changesTouches.length == 1) {
          var touch = changesTouches[0];
          var deltaY = 0;
          if (lastY == 0) {
            lastY = touch.screenY;
          } else {
            deltaY = touch.screenY - lastY;
            lastY = touch.screenY;
            var
              newTop = parseInt(sidebarList.css('top').replace('px', '')) + deltaY,
              maxDelta = $(this).height() - defaultHeight - sidebarList.height();
            if (deltaY > 0 && newTop >= 0) {
              newTop = 0;
            } else if (deltaY < 0 && newTop < maxDelta) {
              newTop = maxDelta;
            }
            sidebarList.css('top', newTop);
          }
        } else if (changesTouches.length > 1) {
          lastY = 0;
        }
      })
      .on('touchend', function (e) {
        lastY = 0;
      });
  }());

  // for image zooming
  (function () {
    var
      lastX = 0,
      lastY = 0,
      posX = 0,
      posY = 0,
    // for double touch
      lastDistance = 0;
    $('#image-extended')
      .on('touchmove', function (e) {
        e.preventDefault();
        $(this).hide().removeClass('loaded').find('img').remove();
      })
      .on('touchmove', 'img', function (e) {
        e.preventDefault();
        e.stopPropagation() || (e.cancelBubble = true);
        var changedTouches = e.originalEvent.changedTouches;
        if (changedTouches.length == 1) {
          var
            touch = changedTouches[0],
            deltaX = 0,
            deltaY = 0;

          posX = parseInt($(this).css('left').replace('px', ''));
          posY = parseInt($(this).css('top').replace('px', ''));

          if (lastX == 0) {
            lastX = touch.screenX;
          } else {
            deltaX = touch.screenX - lastX;
            lastX = touch.screenX;
          }
          if (lastY == 0) {
            lastY = touch.screenY;
          } else {
            deltaY = touch.screenY - lastY;
            lastY = touch.screenY;
          }
          $(this).css({
            left: posX + deltaX,
            top: posY + deltaY
          })
        } else if (changedTouches.length == 2) {
          var
            touchOne = changedTouches[0],
            touchTwo = changedTouches[1],
            distance = (touchOne.screenX - touchTwo.screenX) * (touchOne.screenX - touchTwo.screenX)
              + (touchOne.screenY - touchTwo.screenY) * (touchOne.screenY - touchTwo.screenY),
            deltaWidth = 0,
            width = $(this).width(),
            height = $(this).height(),
            ratio = height / width,
            top = parseInt($(this).css('top').replace('px', '')),
            left = parseInt($(this).css('left').replace('px', ''));
          if (lastDistance != 0) {
            if (distance > lastDistance) {
              deltaWidth = 40;
            } else if (distance < lastDistance) {
              deltaWidth = -40;
            }
          }
          lastDistance = distance;
          if (width + deltaWidth > 320) {
            $(this).css({
              width: width + deltaWidth,
              height: (width + deltaWidth) * ratio,
              left: left - deltaWidth / 2,
              top: top - deltaWidth * ratio / 2
            })
          }
        } else {
          lastX = lastY = lastDistance = posX = posY = 0;
        }
      })
      .on('touchend', 'img', function (e) {
        lastX = lastY = lastDistance = posX = posY = 0;
      })
  }());
});