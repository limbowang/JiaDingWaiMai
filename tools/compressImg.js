var exec = require('child_process').exec;
var fs = require('fs');
var path = require('path');

var INPUT_DIR = '../img_src/pending/';
var OUTPUT_DIR = '../img_src/done/'; 
var MAX_WIDTH_SMALL = 415;
var MAX_WIDTH_LARGE = 1024;

var num = 0;

fs.readdir(INPUT_DIR, function (err, list) {
  if (err) {
    throw err;
  }
  var len = list.length;
  if(!len) {
    done();
  }

  list.forEach(function (filename) {
    fs.stat(path.join(INPUT_DIR, filename), function(err, stat) {
      if(err) {
        throw err; 
      }
      if(!(stat && stat.isFile())) {
        if(!--len) {
          done();
        }

        return;
      } 
      if(path.extname(filename).toLowerCase() != '.jpg') {
        if(!--len) {
          done();
        }

        return;
      }

      compress(filename, MAX_WIDTH_LARGE, function(err){
        if(err) {
          throw err; 
        }

        console.log(filename + '_' + MAX_WIDTH_LARGE + ' compessed');
      });

      compress(filename, MAX_WIDTH_SMALL, function(err){
        if(err) {
          throw err; 
        }

        console.log(filename + '_' + MAX_WIDTH_SMALL + ' compessed');
        num++;
        if(!--len) {
          done();
        }
      });
    });
  });  
});

function compress(filename, maxWidth, callback){
  var command = 'convert -resize ' + '\"' + maxWidth + '>\" ';
  command += path.join(INPUT_DIR, filename) + ' ';
  command += path.join(OUTPUT_DIR, filename + '_' + maxWidth);
  exec(command, callback); 
}

function done(){
  console.log(num + ' images compressed.');
}

