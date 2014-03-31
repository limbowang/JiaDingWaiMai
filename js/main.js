/**
 * Created by Limbo on 14-3-26.
 */

$(document).ready(function () {
  $(window).bind('load resize', function () {
    $(".sidebar").each(function () {
      var sidebarList = $(this).find(".sidebar-list");
      var height = $(this).height() - $(this).find(".sidebar-header").height();
      $(".sidebar-content").css("height", height - 20);
    })
  });

  $(".sidebar-content").bind("mousewheel DOMMouseScroll", function (e) {
    e.preventDefault();
    var d = e.originalEvent.wheelDelta || -e.originalEvent.detail;
    if (d > 0) {
      d = 120;
    } else {
      d = -120
    }
    var sidebarList = $(this).find(".sidebar-list");
    var top = sidebarList.position().top;
    var leftHeight = sidebarList.height() + top;
    console.log(leftHeight);
    console.log($(this).height());
    if (!(d > 0 && top >= 0) && !(d < 0 && leftHeight < $(this).height()))
      sidebarList.css("top", top + d);
  });

  $("#search-box").bind('input propertychange', function () {
    var input = $(this).val();
    $("#sidebar-list").find("li").each(function () {
      if ($(this).text().indexOf(input) < 0) {
        $(this).hide();
      } else {
        $(this).show();
      }
    })
  });

  $(document).delegate('.img-rounded', "click", function () {
    $("#image-extended").show().find("img").attr("src", $(this).attr("src"));
  });

  $("#image-extended")
    .bind("mousewheel DOMMouseScroll", function (e) {
      e.preventDefault();
    })
    .live("click", function () {
      $(this).hide();
    })
    .find("img").bind("click", function (e) {
      if (e.stopPropagation) {
        e.stopPropagation();
      } else {
        e.cancelBubble = true;
      }
    })

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

