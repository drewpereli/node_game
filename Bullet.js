function Bullet()
{
	this.x;
	this.y;
	this.width = 8;
	this.height = 8;
	this.speed = 6;
	this.direction;
	this.dead = false;
}

Bullet.prototype.processCollisions = function()
{
	for (var pI in gameObjects.players)
	{
		var p = gameObjects.players[pI];
		if (collided(this, p))
		{
			p.die();
			this.die();
		}
	}
}

Bullet.prototype.die = function()
{
	this.dead = true;
}