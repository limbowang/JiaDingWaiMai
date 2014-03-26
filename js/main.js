/**
 * Created by Limbo on 14-3-26.
 */

(function() {
    $("#search-box").bind('input propertychange', function() {
        console.log($(this).val());
    })
}());
