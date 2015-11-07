var TV = function () {
	this.mainVersion = 0;
	this.subVersion = 1;
};

TV.CopyObjectProperties = function (source, target)
{
	if (source === undefined || source === null) {
		return;
	}
	
	var property;
	for (property in source) {
		if (source.hasOwnProperty (property)) {
			target[property] = source[property];
		}
	}
};

TV.ModelToScreen = function (original, offset, scale)
{
	return original * scale + offset;
};

TV.ScreenToModel = function (original, offset, scale)
{
	return (original - offset) / scale;
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
