var path = require('path');
var fs = require('fs');
var httpHelpers = require('./http-helpers');
module.exports.datadir = path.join(__dirname, "../data/sites.txt"); // tests will need to override this.
var statusCode = 404;

var webpage;
var text = "";

fs.readFile(module.exports.datadir, function(err, fileContents){
  text += fileContents;
});

webpage = String(fs.readFileSync('./web/index.html'));

var sendFinalResponse = function (req, res){
  res.writeHead(statusCode, httpHelpers.headers);
  res.end(webpage);
};

var sendData = function (req, res){
  statusCode = 200;
  sendFinalResponse(req, res);
};

var saveData = function(req, res){
  var body = "";
  req.on('data', function(chunk){
    body += chunk;
  });
  req.on('end', function(){
    text += "\n" + body;
    statusCode = 201;
    console.log(text);
    sendFinalResponse(req, res);
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
  } else{
    sendFinalResponse(req, res);
  }
};

module.exports.handlePages = function (req, res) {
  console.log("Received " + req.method + " request at URL " + req.url);
  var filePath = './data/sites' + req.url;

  // webpage = String(fs.readFileSync(filePath));

  fs.readFile(filePath, function (err, fileContents) {
    if (err) {
      console.log("Couldn't find file");
      statusCode = 404;
      sendFinalResponse(req, res);
    } else {
      statusCode = 200;
      webpage = String(fileContents);
      sendFinalResponse(req, res);
    }
  });
};






