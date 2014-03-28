var fs = require('fs');

var DIR = 'data';
var results = [];

fs.readdir(DIR, function(err, list) {
  if(err) throw err;
  var len = list.length;
  if(!len) return;

  list.forEach(function(file) {
    file = DIR + '/' + file;
    fs.stat(file, function(err, stat) {
      if(stat && stat.isFile()){
        if(getExtension(file).toLowerCase() == '.json'){
          fs.readFile(file, 'utf8', function(err, data) {
            if(err) throw err;
            results.push(JSON.parse(data));
            if(!--len) done(null, results);
          });
          //results.push(file);
        } else {
          if(!--len) done(null, results);
        }
      }
    });
  });

});


function done(err, results){
  if(err) throw err;

  var ret = {
    items: results
  }

  var outputFilename = 'data/mergedData.json';

  fs.writeFile(outputFilename, JSON.stringify(ret), function(err){
    if(err) throw err;
    console.log(outputFilename + "saved.");
  });
}


function getExtension(filename){
  var i = filename.lastIndexOf('.');
  return (i < 0) ? '' : filename.substr(i);
}
