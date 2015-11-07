var TV = function () {
	this.mainVersion = 0;
	this.subVersion = 1;
};

TV.Point = function (x, y)
{
	this.x = x;
	this.y = y;
};

TV.Point.prototype.Set = function (x, y)
{
	this.x = x;
	this.y = y;
};
