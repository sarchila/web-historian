var fs = require("fs");
var path = require('path');

exports.readUrls = function(filePath, cb){
  fileText = "";
  fs.readFile(filePath,function(err, fileContents){
    fileText += fileContents;
    console.log(filePath, fileText.split('\n'));
    // console.log(JSON.parse(fileContents));
    cb(fileText.split('\n'));
  });
};

exports.downloadUrls = function(urls){
  // fixme
};
