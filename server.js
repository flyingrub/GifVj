var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');
var url = require("url");
var gifs;
init();
console.log('started')
app.listen(1337);

function init () {
  fs.readdir('gif', function(err, items) { 
    gifs = items.filter(function(item) {  return item.endsWith('.gif') });
  });
}

function handler (req, res) {
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

io.on('connection', randomGif);

function randomGif(socket) {
  var index =  Math.floor((Math.random() * gifs.length - 1) + 0); 
  socket.emit('gif', { 'gif': gifs[index] });
  var randomTime = Math.floor((Math.random() * 6) + 2) * 1000; 
  setTimeout(function() { randomGif(socket) }, randomTime);
}
