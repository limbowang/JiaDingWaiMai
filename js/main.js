/**
 * Created by Limbo on 14-3-26.
 */

$(document).ready(function () {
  $('.sidebar-content')
    .on('mousewheel DOMMouseScroll', function (e) {
      e.preventDefault();
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
      .on('click', function () {
        $(this).hide().find('img').remove();
        mousedownX = mousedownY = 0;
      })
      .on('mousemove', function (e) {
        e.preventDefault();
        e = e || window.event;
        var button = e.buttons == undefined ? e.which : e.buttons;
        if (button == 1) {
          $(this).find('img').css({
            'left': e.screenX - mousedownX + posX,
            'top': e.screenY - mousedownY + posY
          })
        }
      })
      .on('mousedown', 'img', function (e) {
        e.preventDefault();
        mousedownX = e.screenX;
        mousedownY = e.screenY;
        posX = parseInt($(this).css('left').replace('px', ''));
        posY = parseInt($(this).css('top').replace('px', ''));
      })
      .on('click', 'img', function (e) {
        e.stopPropagation() || (e.cancelBubble = true);
      })
      .on('mousewheel DOMMouseScroll', 'img', function (e) {
        var d = e.originalEvent.wheelDelta || -e.originalEvent.detail;
        var width = $(this).width();
        var height = $(this).height();
        var ratio = height / width;
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
      })
      // for mobile
      .on('touchstart', function (e) {
        e.preventDefault();
        var touches = e.touches;
        console.log(e);
        if (touches.size() == 1) {
          var touch = touches[0];
          mousedownX = e.screenX;
          mousedownY = e.screenY;
          posX = parseInt($(this).css('left').replace('px', ''));
          posY = parseInt($(this).css('top').replace('px', ''));
        }
      })
      .on('touchmove', function (e) {
        console.log(e);
      });
  }());

  (function loadData() {
    $.getJSON('data/merged/mergedData.json', function (data) {
      document.getElementById('sidebar-list').innerHTML += new EJS({url: 'templates/sidebar-list.ejs'}).render(data);
    });
    $.getJSON('data/merged/contents-left.json', function (data) {
      document.getElementById('contents-left').innerHTML += new EJS({url: 'templates/contents.ejs'}).render(data);
    });
    $.getJSON('data/merged/contents-right.json', function (data) {
      document.getElementById('contents-right').innerHTML += new EJS({url: 'templates/contents.ejs'}).render(data);
    });

  }());

});

