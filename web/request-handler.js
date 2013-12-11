var path = require('path');
var fs = require('fs');
var httpHelpers = require('./http-helpers');
module.exports.datadir = path.join(__dirname, "../data/sites.txt"); // tests will need to override this.

var text;
var sitesUrls = {};


var parseSitesFile = function () {
  var sitesUrlsList = String(fs.readFileSync(module.exports.datadir)).split('\n');
  sitesUrlsList.pop();
  sitesUrlsList.forEach(function (eachUrl) {
    sitesUrls[eachUrl] = true;
  });
};

parseSitesFile();

var sendFinalResponse = function (req, res, statusCode, headers, body){
  res.writeHead(statusCode, headers);
  res.end(body);
};

var sendData = function (req, res){
  var webpage = String(fs.readFileSync('./web/public/index.html'));
  sendFinalResponse(req, res, 200, httpHelpers.headers, webpage);
};

var saveData = function(req, res){

  text = String(fs.readFileSync(module.exports.datadir));
  var body = "";

  req.on('data', function(chunk){
    body += chunk;
  });

  req.on('end', function(){
    var userUrl = String(body).slice(4);

    if (sitesUrls[userUrl]){
      sendFinalResponse(req, res, 302, {Location: userUrl}, null);
    } else {
      text += userUrl + "\n";
      sitesUrls[userUrl] = true;
      fs.writeFile(module.exports.datadir, text, function(){
        sendFinalResponse(req, res, 302, {Location: userUrl}, null);
      });
    }
  });
};

var sendOptions = function(req, res){
  sendFinalResponse(req, res, 200, httpHelpers.headers, null);
};

var verbs = {
  'GET': sendData,
  'POST': saveData,
  'OPTIONS': sendOptions
};

module.exports.handleRoot = function (req, res) {
  console.log("Received " + req.method + " request at URL " + req.url);
  if (verbs[req.method]){
    verbs[req.method](req, res);
  } else {
    sendFinalResponse(req, res, 405, httpHelpers.headers, null);
  }
};

module.exports.handleCachedPages = function (req, res) {
  console.log("Received " + req.method + " request at URL " + req.url);

  var filePath = './data/sites' + req.url;
  setResponseBody(req, res, filePath);

  // if req.url is in the obj
  //   respond with cached page
  // else
  //   if url exists in /web/public
  //     respond with static asset
  //   else
  //     add it to obj and sites.txt

};

module.exports.handleStaticAssets = function (req, res) {
  console.log("Received " + req.method + " request at URL " + req.url);

  var filePath = './web' + req.url;
  setResponseBody(req, res, filePath);
};


var setResponseBody = function (req, res, filePath) {
  fs.readFile(filePath, function (err, fileContents) {
    if (err) {
      // error retrieving page
      sendFinalResponse(req, res, 404, httpHelpers.headers, null);
    } else {
      // success
      var webpage = String(fileContents);
      sendFinalResponse(req, res, 200, httpHelpers.headers, webpage);
    }
  });
};





