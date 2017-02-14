function Bullet(shooter)
{
	this.shooter = shooter;
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
	for (var pI in game.players)
	{
		var p = game.players[pI];
		if (tools.collided(this, p))
		{
			this.shooter.score += 100;
			io.emit("update score", {score: this.shooter.score});
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