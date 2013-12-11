var path = require('path');
var fs = require('fs');
var httpHelpers = require('./http-helpers');
module.exports.datadir = path.join(__dirname, "../data/sites.txt"); // tests will need to override this.
var statusCode = 404;

var webpage, text;
var sitesUrls = {};


var parseSitesFile = function () {
  var sitesUrlsList = String(fs.readFileSync(module.exports.datadir)).split('\n');
  sitesUrlsList.pop();
  sitesUrlsList.forEach(function (eachUrl) {
    sitesUrls[eachUrl] = true;
  });
};

parseSitesFile();

var sendFinalResponse = function (req, res){
  res.writeHead(statusCode, httpHelpers.headers);
  res.end(webpage);
};

var sendData = function (req, res){
  webpage = String(fs.readFileSync('./web/public/index.html'));
  statusCode = 200;
  sendFinalResponse(req, res);
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
      statusCode = 302;
      res.writeHead(statusCode, {Location: userUrl});
      res.end();
    } else {
      text += userUrl + "\n";
      sitesUrls[userUrl] = true;
      fs.writeFile(module.exports.datadir, text, function(){
        statusCode = 302;
        sendFinalResponse(req, res);
      });
    }
  });
};

var sendOptions = function(req, res){
  statusCode = 200;
  sendFinalResponse(req, res);
};

var verbs = {
  'GET': sendData,
  'POST': saveData,
  'OPTIONS': sendOptions
};

module.exports.handleRequest = function (req, res) {
  console.log("Received " + req.method + " request at URL " + req.url);
  if (verbs[req.method]){
    verbs[req.method](req, res);
  } else {
    statusCode = 405;
    sendFinalResponse(req, res);
  }
};

module.exports.handlePages = function (req, res) {
  console.log("Received " + req.method + " request at URL " + req.url);
  var filePath = './data/sites' + req.url;
  fs.readFile(filePath, function (err, fileContents) {
    if (err) {
      // error retrieving page
      statusCode = 404;
      webpage = String(fs.readFileSync('./web/public/index.html'));
      sendFinalResponse(req, res);
    } else {
      // success
      statusCode = 200;
      webpage = String(fileContents);
      sendFinalResponse(req, res);
    }
  });
};






