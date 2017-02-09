var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var game = new (require('./Game.js'))();
var playerConstructor = require('./Player.js');
var bulletConstructor = require('./Bullet.js');
var gameObjects = {"players": {}, "bullets": []};
var canvasWidth = 500;
var canvasHeight = 500;
var frameRate = 20;
var colors = [
	"black",
	"red",
	"purple",
	"green",
	"blue",
];

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var tick = function()
{
	for (var pI in gameObjects.players)
	{
		var p = gameObjects.players[pI];
		if (p.moving)
		{
			var newX = p.x;
			var newY = p.y;
			switch (p.moving)
			{
				//Check boundaries later
				case 37:
					newX += -1 * p.speed;
					break;
				case 38:
					newY += -1 * p.speed;
					break;
				case 39:
					newX += p.speed;
					break;
				case 40:
					newY += p.speed;
					break;
				default:
					console.log("there was an moving. Direction: " + p.moving );
			}
			if (newX > 0 && newX < canvasWidth - p.width
				&& newY > 0 && newY < canvasHeight - p.height)
			{
				p.x = newX;
				p.y = newY;
			}
		}
		if (p.framesUntilNextShot > 0)
		{
			p.framesUntilNextShot--;
		}
		else if (p.shooting)
		{
			p.shoot();
		}
		gameObjects.players[pI] = p;
	}
	for (var bI in gameObjects.bullets)
	{
		var b = gameObjects.bullets[bI];
		var newX = b.x;
		var newY = b.y;
		switch (b.direction)
		{
			//Check boundaries later
			case 37:
				newX -= b.speed;
				break;
			case 38:
				newY -= b.speed;
				break;
			case 39:
				newX += b.speed;
				break;
			case 40:
				newY += b.speed;
				break;
			default:
				console.log("there was an error with the bullet.");
		}
		
		b.x = newX;
		b.y = newY;
		b.processCollisions();
		if (!b.dead && (b.x < 0 || b.y < 0 || b.x > canvasWidth - b.width || b.y > canvasHeight - b.height))
		{
			b.die();
		}
	}
	for (var pI in gameObjects.players)
	{
		if (gameObjects.players[pI].dead)
			delete gameObjects.players[pI];
	}
	for (var i = gameObjects.bullets.length - 1 ; i >= 0 ; i--)
	{
		var b = gameObjects.bullets[i];
		if (b.dead)
			gameObjects.bullets.splice(i, 1);
	}
	io.emit("update board", gameObjects);
}

io.on('connection', function(socket){
	gameObjects.players[socket.id] = new Player();
	gameObjects.players[socket.id].spawnRandomly();
	socket.on('document ready', function(){
		socket.emit('set canvas dimensions', {width: canvasWidth, height: canvasHeight});
	});
	socket.on('player move', function(dir)
	{
		gameObjects.players[socket.id].moving = dir;
	});
	socket.on('player stop', function(dir){
		if (gameObjects.players[socket.id].moving === dir)
		{
			gameObjects.players[socket.id].moving = false;
		}
	});
	socket.on('player shoot', function()
	{
		var p = gameObjects.players[socket.id]
		if (p.framesUntilNextShot <= 0)
			p.shooting = true;
	});
	socket.on('disconnect', function(){
		if (gameObjects.players[socket.id])
			gameObjects.players[socket.id].die();
	});
});

http.listen(8000, function(){
});

setInterval(tick, frameRate);





