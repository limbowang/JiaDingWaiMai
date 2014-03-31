var fs = require('fs');

var DIR = '../data';
var results = [];
var contents_left = [];
var contents_right = [];

fs.readdir(DIR, function(err, list) {
  if(err) throw err;
  var len = list.length;
  if(!len) return;

  list.forEach(function(file) {
    file = DIR + '/' + file;
    fs.stat(file, function(err, stat) {
      if(err) throw err;
      if(!(stat && stat.isFile())) {
        if(!--len) done(null);
        return;
      }
      if(getExtension(file).toLowerCase() != '.json'){
        if(!--len) done(null);
        return;
      }

      fs.readFile(file, 'utf8', function(err, data) {
        if(err) throw err;

        results.push(JSON.parse(data));
        if(results.length % 2 != 0){
          contents_left.push(JSON.parse(data));
        } else {
          contents_right.push(JSON.parse(data));
        }
        if(!--len) done(null);
      });
    });
  });

});


function done(err){
  if(err) throw err;

  writeResults(DIR+'/merged/mergedData.json', results);
  writeResults(DIR+'/merged/contents-left.json', contents_left);
  writeResults(DIR+'/merged/contents-right.json', contents_right);
}

function writeResults(filename, results){
  var ret = {
    items: results
  }

  fs.writeFile(filename, JSON.stringify(ret, null, 2), function(err){
    if(err) throw err;
    console.log(filename+ "saved.");
  });
}

function getExtension(filename){
  var i = filename.lastIndexOf('.');
  return (i < 0) ? '' : filename.substr(i);
}
