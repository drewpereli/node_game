function Player()
{
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
	this.color = getNextPlayerColor();
}

function getNextPlayerColor()
{
	if (colors.length > 0)
	{
		return colors.pop();
	}
	else
	{
		return getRandomColor();
	}
}



Player.prototype.shoot = function()
{
	//Generate four bullets, centered on the player
	for (var i = 0 ; i < 4 ; i++)
	{
		var b = new Bullet();
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
		gameObjects.bullets.push(b);
	}
	this.shooting = false;
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
		for (var pI in gameObjects.players)
		{
			var p = gameObjects.players[pI];
			if (p !== this && collided(this, p))
			{
				continue attempting;
			}
		}
		for (var bI in gameObjects.bullets)
		{
			var b = gameObjects.bullets[bI];
			if (collided(this, b))
			{
				continue attempting;
			}
		}
		return;
	} while (attempts < 500)
	this.die();
}

Player.prototype.die = function()
{
	this.dead = true;
}