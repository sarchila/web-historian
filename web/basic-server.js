var http = require("http");
var handler = require("./request-handler");

var port = 8080;
var ip = "127.0.0.1";

var server = http.createServer(function(req, res){
  var path = req.url;
  if (path === '/') {
    handler.handleRoot(req, res);
  } else if (path.slice(0,7) === '/public') {
    handler.handleStaticAssets(req, res);
  } else {
    handler.handleCachedPages(req, res);
  }
});

console.log("Listening on http://" + ip + ":" + port);
server.listen(port, ip);

