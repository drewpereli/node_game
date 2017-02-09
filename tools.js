


function collided(rect1, rect2)
{
	if (rect1.x < rect2.x + rect2.width &&
   rect1.x + rect1.width > rect2.x &&
   rect1.y < rect2.y + rect2.height &&
   rect1.height + rect1.y > rect2.y) {
   		return true;
	}
	return false;
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function getNextPlayerColor()
{
	if (availableColors.length > 0)
	{
		return availableColors.pop();
	}
	else
	{
		return getRandomColor();
	}
}

module.exports = 
{
	collided: collided,
	getRandomColor: getRandomColor,
	getNextPlayerColor: getNextPlayerColor
}