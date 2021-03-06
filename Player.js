function Player(sId, username)
{
	this.socketId = sId;
	this.username = username;
	this.score = 0;
	this.x;
	this.y;
	this.width = 16;
	this.height = 16;
	this.speed = 4;
	this.moving = false;
	this.shooting = false;
	this.shootTime = .5; //In seconds.
	this.shootFrames = this.shootTime * 1000 / frameRate;
	this.framesUntilNextShot = 0;
	this.dead = false;
	this.respawnTime = 1; //In seconds.
	this.respawnFrames = this.respawnTime * 1000 / frameRate;
	this.framesUntilRespawn;
	this.quiting = false;
	this.color = tools.getNextPlayerColor();
}



Player.prototype.shoot = function()
{
	//Generate four bullets, centered on the player
	for (var i = 0 ; i < 4 ; i++)
	{
		var b = new bulletConstructor(this);
		b.y = this.y + this.height / 2 - b.height / 2; //Centered on player by default
		b.x = this.x + this.width / 2 - b.width / 2;
		switch (i)
		{
			case 0:
				b.x = this.x - b.width;
				break;
			case 1:
				b.y = this.y - b.height;
				break;
			case 2:
				b.x = this.x + this.width;
				break;
			case 3:
				b.y = this.y + this.height;
				break;
		}
		b.direction = 37 + i;
		game.bullets.push(b);
	}
	this.framesUntilNextShot = this.shootFrames;
}

Player.prototype.spawnRandomly = function()
{
	var attempts = 0;
	var collides = false;
	attempting: 
	do {
		attempts++;
		this.x = Math.floor(Math.random() * (canvasWidth - this.width));
		this.y = Math.floor(Math.random() * (canvasHeight - this.height));
		for (var pI in game.players)
		{
			var p = game.players[pI];
			if (p !== this && tools.collided(this, p))
			{
				continue attempting;
			}
		}
		for (var bI in game.bullets)
		{
			var b = game.bullets[bI];
			if (tools.collided(this, b))
			{
				continue attempting;
			}
		}
		return;
	} while (attempts < 500)
	this.die();
}

Player.prototype.respawn = function()
{
	this.dead = false;
	this.framesUntilNextShot = 0;
	this.moving = false;
	this.spawnRandomly();
}

Player.prototype.die = function()
{
	this.dead = true;
	this.framesUntilRespawn = this.respawnFrames;
}

Player.prototype.quit = function()
{
	this.quiting = true;
	if (colors.indexOf(this.color) !== -1)
	{
		availableColors.push(this.color);
	}
}

module.exports = Player;


