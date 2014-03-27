/**
 * Created by Limbo on 14-3-26.
 */

(function() {
    $("#search-box").bind('input propertychange', function() {
        console.log($(this).val());
    });
}());

function OnSearchInput(event){
  var content = event.target.value;
  var items = $("#sidebar-list").find("li");
  for(var i = 0; i < items.length; i++) {
    if(items.eq(i).text().indexOf(content) < 0){
      items.eq(i).hide();
    }else{
      items.eq(i).show();
    }
  }
}

