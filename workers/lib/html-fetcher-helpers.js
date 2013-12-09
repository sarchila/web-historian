var fs = require("fs");
var path = require('path');

exports.readUrls = function(filePath, cb){
  fileText = "";
  fs.readFile(filePath, function(err, fileContents){
    var urlArray = String(fileContents).split('\n');
    cb(urlArray);
  });
};

exports.downloadUrls = function(urls){
  // fixme
};
