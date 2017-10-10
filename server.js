var app = require('http').createServer(handler)
var io = require('socket.io')(app);
io.on('connection', randomGif);
var fs = require('fs');
var url = require("url");
var gifs;
init();
console.log('http://localhost:1337')
app.listen(1337);

function init() {
  fs.readdir('gif', function(err, items) {
    gifs = items.filter(function(item) {  return item.endsWith('.gif') });
  });
}

function handler(req, res) {
  var pathname = url.parse(req.url).pathname;
  if (pathname == '/' || pathname == '/index.html') {
    fs.readFile(__dirname + '/index.html', function(err, data) {
      res.writeHead(200);
      res.end(data);
    });
  } else {
    fs.readFile(__dirname + pathname, function (err, data) {
      res.writeHead(200);
      res.end(data);
    });
  }
}


function randomGif(socket) {
  var index =  Math.floor((Math.random() * gifs.length - 1) + 0);
  // console.log('test ' + index + '|' + gifs[index])
  socket.emit('gif', { 'gif': gifs[index] });
  var randomTime = (Math.random() * 5 + 0.6 ) * 500;
  setTimeout(function() { randomGif(socket) }, randomTime);
}
