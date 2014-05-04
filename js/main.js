/**
 * Created by Limbo on 14-3-26.
 */

$(document).ready(function () {
  $('.sidebar').on('mousewheel DOMMouseScroll', function (e) {
    e.preventDefault();
  });

  $('.sidebar-content')
    .on('mousewheel DOMMouseScroll', function (e) {
      var d = e.originalEvent.wheelDelta || -e.originalEvent.detail;
      d = d > 0 ? 120 : -120;
      var sidebarList = $(this).find('.sidebar-list');
      var top = parseInt(sidebarList.css('top').replace('px', ''));
      if (!(d > 0 && top >= 0) && !(d < 0 && sidebarList.height() + top - d < $(this).height()))
        sidebarList.css('top', top + d);
    })
    .on('click', function () {
      var parent = $(this).parent();
      parent.removeClass('open');
    })
    .on('click', '.sidebar-search', function (e) {
      e.stopPropagation() || (e.cancelBubble = true);
    });

  $('#search-box').on('input propertychange', function () {
    var input = $(this).val();
    $('#sidebar-list').find('li').each(function () {
      if ($(this).text().indexOf(input) < 0) {
        $(this).hide();
      } else {
        $(this).show();
      }
    })
  });

  $('#pull-button').on('click', function () {
    $('.sidebar').toggleClass('open');
  });

  $('#contents').on('click', '.img-rounded', function () {
    var
      imgExt = $('#image-extended'),
      imgMain;
    imgExt
      .show()
      .append('<img src="' + $(this).attr('src').replace('415', '1024') + '"/>');
    imgMain = imgExt.find('img').load(function () {
      var windowHeight = $(window).height();
      var imgHeight = $(this).height();
      imgExt.addClass('loaded');
      imgMain.css({
        'top': imgHeight < windowHeight ? (windowHeight - imgHeight) / 2 : 0,
        'visibility': 'visible'
      });
    });
  });

  (function () {
    var
      mousedownX = 0,
      mousedownY = 0,
      posX = 0,
      posY = 0;

    $('#image-extended')
      .on('mousewheel DOMMouseScroll', function (e) {
        e.preventDefault();
      })
      .on('mousedown', function () {
        $(this).hide().removeClass('loaded').find('img').remove();
        mousedownX = mousedownY = 0;
      })
      .on('mousemove', 'img', function (e) {
        e.preventDefault();
        e = e || window.event;
        var button = e.buttons == undefined ? e.which : e.buttons;
        if (button == 1) {
          $(this).css({
            'left': e.screenX - mousedownX + posX,
            'top': e.screenY - mousedownY + posY
          })
        }
      })
      .on('mousedown', 'img', function (e) {
        e.preventDefault();
        e.stopPropagation() || (e.cancelBubble = true);
        mousedownX = e.screenX;
        mousedownY = e.screenY;
        posX = parseInt($(this).css('left').replace('px', ''));
        posY = parseInt($(this).css('top').replace('px', ''));
      })
      .on('mousewheel DOMMouseScroll', 'img', function (e) {
        var
          d = e.originalEvent.wheelDelta || -e.originalEvent.detail,
          width = $(this).width(),
          height = $(this).height(),
          ratio = height / width;
        if (d > 0) {
          $(this).css({
            'width': width + 30,
            'height': (width + 30) * ratio
          });
        } else if (d < 0 && width > 160) {
          $(this).css({
            'width': width - 30,
            'height': (width - 30) * ratio
          });
        }
      });
  }());
});
