var exec = require('child_process').exec;
var fs = require('fs');

var INPUT_DIR = '../img_src/pending/';
var OUTPUT_DIR = '../img_src/done/'; 
var num = 0;

fs.readdir(INPUT_DIR, function(err, list) {
  if(err) throw err;
  var len = list.length;
  if(!len) return;

  list.forEach(function(filename) {
    fs.stat(INPUT_DIR+filename, function(err, stat) {
      if(err) throw err; 
      if(!(stat && stat.isFile())) {
        if(!--len) done();
        return;
      } 
      if(getExtension(filename).toLowerCase() != '.jpg') {
        if(!--len) done();
        return;
      }

      compress(filename, function(err){
        if(err) throw err; 

        console.log(filename + ' compessed');
        num++;
        if(!--len) done();
      });
    });
  });  
});

function compress(filename, callback){
  exec('convert -resize 10% '+INPUT_DIR+filename+' '+OUTPUT_DIR+filename, callback); 
}

function done(){
  console.log(num + ' images compressed.');
}

function getExtension(filename){
  var i = filename.lastIndexOf('.');
  return (i < 0) ? '' : filename.substr(i);
}
