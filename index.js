var app = require('express')();
var http = require('http').Server(app);
global.game = new (require('./Game.js'))();
global.io = require('socket.io')(http);
global.tools = require('./tools.js');
global.playerConstructor = require('./Player.js');
global.bulletConstructor = require('./Bullet.js');
global.canvasWidth = 500;
global.canvasHeight = 500;
global.frameRate = 20;
global.colors = [
	"black",
	"red",
	"purple",
	"green",
	"blue",
]
global.availableColors = colors.slice();

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});



io.on('connection', function(socket){
	var newP = new playerConstructor(socket.id);
	newP.spawnRandomly();
	game.newPlayers.push(newP);
	socket.on('document ready', function(){
		socket.emit('set canvas dimensions', {width: canvasWidth, height: canvasHeight});
	});
	socket.on('player move', function(dir)
	{
		game.findPlayer(socket.id).moving = dir;
	});
	socket.on('player stop', function(dir){
		var p = game.findPlayer(socket.id);
		if (p && p.moving === dir)
		{
			p.moving = false;
		}
	});
	socket.on('player shoot', function()
	{
		var p = game.findPlayer(socket.id);
		if (p && p.framesUntilNextShot <= 0)
			p.shoot();
	});
	socket.on('disconnect', function(){
		if (p = game.findPlayer(socket.id))
			p.die();
	});
});

http.listen(8000, function(){
});

setInterval(()=>{game.tick();}, frameRate);





