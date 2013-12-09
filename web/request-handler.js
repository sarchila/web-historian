var path = require('path');
var fs = require('fs');
var httpHelpers = require('./http-helpers');
module.exports.datadir = path.join(__dirname, "../data/sites.txt"); // tests will need to override this.
var statusCode = 404;

var text = "";

fs.readFile(module.exports.datadir, function(err, fileContents){
  text += fileContents;
});

var sendFinalResponse = function (req, res){
  statusCode = 200;
  res.writeHead(statusCode, httpHelpers.headers);
  console.log(module.exports.datadir);
  res.end(text);
  console.log(exports.datadir);
};

var sendData = function (req, res){
  sendFinalResponse(req, res);
};

var saveData = function(req, res){
  var body = "";
  req.on('data', function(chunk){
    body += chunk;
  });
  req.on('end', function(){
    text += body;
    statusCode = 201;
    sendFinalResponse(req, res);
  });
};

var sendOptions = function(req, res){
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
    console.log("verb found");
    verbs[req.method](req, res);
  } else{
    sendFinalResponse(req, res);
  }
};
