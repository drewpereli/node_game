function Bullet(color)
{
	this.x;
	this.y;
	this.width = 8;
	this.height = 8;
	this.speed = 6;
	this.direction;
	this.dead = false;
	this.color = color;
}

Bullet.prototype.processCollisions = function()
{
	for (var pI in game.players)
	{
		var p = game.players[pI];
		if (tools.collided(this, p))
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

module.exports = Bullet;