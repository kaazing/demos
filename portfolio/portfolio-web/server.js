// Server code run with node.js
var express = require('express');
var uri = 'localhost';
var port = 3000;
var app = express();
var http = require('http').Server(app);
app.use(express.static(__dirname + 'node_modules'));
app.use(express.static(__dirname));

http.listen(port, uri, function () {
    console.log('listening on ' +  uri+ ':3000');
});
