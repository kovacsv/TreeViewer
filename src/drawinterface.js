TV.DrawStyle = function (parameters)
{
	this.fontSize = 12;
	this.fontFamily = 'Arial';
	this.lineWidth = 1;
	
	this.textColorNoChildren = '#000000';
	this.textColorWithChildren = '#000000';
	
	this.rectColorNoChildren = '#000000';
	this.rectColorWithChildren = '#000000';

	this.nodeColorNoChildren = '#ffffff';
	this.nodeColorWithChildren = '#f5f5f5';

	this.lineColor = '#000000';
	
	TV.CopyObjectProperties (parameters, this);
};

TV.DrawStyle.prototype.GetFontSize = function (scale)
{
	var fontSize = this.fontSize * scale;
	return Math.round (fontSize);
};

TV.DrawStyle.prototype.GetFontFamily = function ()
{
	return this.fontFamily;
};

TV.DrawStyle.prototype.GetLineWidth = function (scale)
{
	var lineWidth = this.lineWidth * scale;
	return Math.round (lineWidth);
};

TV.DrawStyle.prototype.GetTextColor = function (node)
{
	if (node.HasChild ()) {
		return this.textColorWithChildren;
	}
	return this.textColorNoChildren;
};

TV.DrawStyle.prototype.GetRectColor = function (node)
{
	if (node.HasChild ()) {
		return this.rectColorWithChildren;
	}
	return this.rectColorNoChildren;
};

TV.DrawStyle.prototype.GetNodeColor = function (node)
{
	if (node.HasChild ()) {
		return this.nodeColorWithChildren;
	}
	return this.nodeColorNoChildren;
};

TV.DrawStyle.prototype.GetLineColor = function (node)
{
	return this.lineColor;
};
