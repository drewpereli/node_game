
function Game()
{
	this.players = [];
	this.bullets = [];
}

Game.prototype.tick = function()
{
	for (var bI in this.bullets)
	{
		var b = this.bullets[bI];
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
	for (var pI in this.players)
	{
		var p = this.players[pI];
		if (!p.dead)
		{
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
				if (newX >= 0 && newX <= canvasWidth - p.width
					&& newY >= 0 && newY <= canvasHeight - p.height)
				{
					p.x = newX;
					p.y = newY;
				}
			}
			if (p.framesUntilNextShot > 0)
			{
				p.framesUntilNextShot--;
			}
		}
		else
		{
			p.framesUntilRespawn--;
			if (p.framesUntilRespawn <= 0)
				p.respawn();
		}
	}

	for (var i = this.players.length - 1 ; i >= 0 ; i--)
	{
		if (this.players[i].quiting)
			this.players.splice(i, 1);
	}
	for (var i = this.bullets.length - 1 ; i >= 0 ; i--)
	{
		var b = this.bullets[i];
		if (b.dead)
			this.bullets.splice(i, 1);
	}
	io.emit("update board", {players: this.getClientPlayerInfo(), bullets: this.getClientBulletInfo()});
}


Game.prototype.getClientPlayerInfo = function()
{
	return this.players.map((p)=>{
		return {
			color: p.color,
			width: p.width,
			height: p.height,
			x: p.x,
			y: p.y,
			dead: p.dead
		}
	});
}

Game.prototype.getClientBulletInfo = function()
{
	return this.bullets.map((b)=>{
		return {
			color: b.color,
			width: b.width,
			height: b.height,
			x: b.x,
			y: b.y
		}
	});
}


Game.prototype.findPlayer = function(id)
{
	for (var i in this.players)
	{
		if (this.players[i].socketId === id)
			return this.players[i];
	}
	return false;
}

module.exports = Game;




