var fs = require("fs");
var path = require('path');
var http = require('http-request');
module.exports.datadir = path.join(__dirname, "../data/sites/"); // tests will need to override this.

exports.readUrls = function(filePath, cb){
  fileText = "";
  fs.readFile(filePath, function(err, fileContents){
    var urlArray = String(fileContents).split('\n');
    cb(urlArray);
  });
};

exports.downloadUrls = function(urls){
  urls = urls || [];

  for (var i = 0; i < urls.length; i++) {
    var path = module.exports.datadir + urls[i];
    http.get(urls[i], path, function (err, res) {
      if (err) {
        console.log('Error fetching ' + urls[i]);
      }
    });
  }


  return urls;
};
