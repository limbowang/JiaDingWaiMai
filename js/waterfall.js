/**
 * Created by Limbo on 2014/5/5.
 */

var Waterfall = function () {
  var _ = this;
  _.selector = null;
  _.itemList = null;
  _.isResizing = false;
  _.minCol = 1;
  _.width = 480;
  _.heightList = [];
};

Waterfall.prototype.init = function (selector, options) {
  var _ = this;

  if (typeof selector !== 'String' && $(selector) == null) {
    throw DOMException;
  } else {
    _.selector = $(selector);
    _.itemList = _.selector.children('.waterfall');
  }
  // TODO handle options
//  if (typeof options !== 'Object') {
//    throw DOMException;
//  }
  $(window)
    .on('load', function() {
      _.resize()
    })
    .resize(function() {
      _.buffer()
    });
};

Waterfall.prototype.resize = function () {
  var _ = this;
  var colNum = Math.floor(_.selector.width() / _.width);
  if (colNum < _.minCol) {
    colNum = _.minCol;
  }
  // init height list
  _.heightList = new Array(colNum);
  for (var i = 0; i < colNum; ++i) {
    _.heightList[i] = 0;
  }
  // start resizing
  for (i = 0; i < _.itemList.length; ++i) {
    var
      $item = $(_.itemList[i]),
      index = _.idxOfMinHeight();
    $item.css({
      left: index % colNum * _.width,
      top: _.heightList[index],
      visibility: 'visible'
    });
    _.heightList[index] += $item.height();
    console.log($item.height());
  }
};

Waterfall.prototype.buffer = function () {
  var _ = this;
  console.log(!_.isResizing);
  if (!_.isResizing) {
    _.isResizing = true;
    setTimeout(function () {
      if (!_.isResizing) {
        _.resize();
        _.isResizing = false;
      }
    }, 1000);
  }
};

Waterfall.prototype.idxOfMinHeight = function () {
  var _ = this;
  var
    minIndex = 0;
  for (var i = 1; i < _.heightList.length; ++i) {
    if (_.heightList[i] < _.heightList[minIndex]) {
      minIndex = i;
    }
  }
  return minIndex;
};