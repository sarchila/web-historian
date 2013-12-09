var http = require("http");
var handler = require("./request-handler");

var port = 8080;
var ip = "127.0.0.1";

var router = {
  '/': handler.handleRequest
};

var server = http.createServer(function(req, res){
  var path = req.url;
  if (router[path]) {
    router[path](req, res);
  } else {
    // 404
  }
});
console.log("Listening on http://" + ip + ":" + port);
server.listen(port, ip);

