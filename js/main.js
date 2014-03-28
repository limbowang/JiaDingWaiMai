/**
 * Created by Limbo on 14-3-26.
 */

$(document).ready(function () {
    $(window).bind('load resize', function () {
        $(".sidebar").each(function () {
            var height = $(this).height() - $(this).find(".sidebar-header").height();
            $(".sidebar-content").css("height", height - 20);
        })
    });

    $(".sidebar-content").bind("mousewheel", function (e) {
        e.preventDefault();
        var d = e.originalEvent.wheelDelta;
        var sidebarList = $(this).find(".sidebar-list");
        var top = sidebarList.position().top;
        var visibleHeight = sidebarList.height() + top;
        if (!(d > 0 && top == 0) && !(d < 0 && visibleHeight < $(this).height()))
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
});

