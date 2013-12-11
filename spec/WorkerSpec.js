var stubs = require("./helpers/stubs");
var htmlFetcherHelpers = require("../workers/lib/html-fetcher-helpers");
htmlFetcherHelpers.datadir = __dirname + "/testdata/sites/";
var fs = require("fs");
var path = require('path');
var rmdir = require('rimraf');

function async(cb){
  waits(1000);
  runs(cb);
}

beforeEach(function () {
  fs.mkdirSync(htmlFetcherHelpers.datadir);
});

afterEach(function () {
  rmdir.sync(htmlFetcherHelpers.datadir, function(err){
    console.log("error removing dir: ", err);
  });
});

describe("html fetcher helpers", function(){

  describe("readUrls", function(){
    it("should have a 'readUrls' function", function(){
      var urlArray = ["example1.com", "example2.com"];

      var filePath = path.join(__dirname, "/testdata/sites.txt");

      fs.writeFileSync(filePath, urlArray.join("\n"));

      var resultArray;

      runs(function(){
        htmlFetcherHelpers.readUrls(filePath, function(urls){
          resultArray = urls;
        });
      });

      waits(1000);

      runs(function() {
        expect(resultArray).toEqual(urlArray);
      });
    });
  });

  describe("downloadUrls", function(){

    it("should have a 'downloadUrls' function", function(){
      var result = htmlFetcherHelpers.downloadUrls();
      expect(result).toBeTruthy();
    });

    it("should save input URLs to sites folder", function () {
      htmlFetcherHelpers.downloadUrls(['127.0.0.1:8080']);
      waits(1000);
      runs(function(){
        var files = fs.readdirSync(htmlFetcherHelpers.datadir);
        expect(files).toEqual(['127.0.0.1:8080']);
      });
    });

    // write test to see if file in sites folder contains the site's HTML

  });


});
