TV.TreeViewer = function (drawInterface)
{
	this.drawInterface = drawInterface;
	this.drawInterface.RegisterEvents ({
		onMouseDown : this.OnMouseDown.bind (this),
		onMouseUp : this.OnMouseUp.bind (this),
		onMouseMove : this.OnMouseMove.bind (this),
		onMouseWheel : this.OnMouseWheel.bind (this)
	});
	
	this.offset = new TV.Point (50, 200);
	this.scale = 1.0;
	this.layout = new TV.TreeLayout ();
	this.mouse = null;
	this.move = null;
};

TV.TreeViewer.prototype.LoadJson = function (jsonData)
{
	this.layout.LoadJson (jsonData);
	this.CalculateLayout ();
};

TV.TreeViewer.prototype.CalculateLayout = function ()
{
	this.layout.CalculateLayout ();
	this.Update ();
};

TV.TreeViewer.prototype.Update = function ()
{
	var drawInterface = this.drawInterface;
	drawInterface.UpdateStart ();
	
	var offset = this.offset;
	var scale = this.scale;
	this.layout.EnumerateNodes (function (node) {
		drawInterface.UpdateNode (node, offset, scale);
	});
	
	drawInterface.UpdateEnd ();
};

TV.TreeViewer.prototype.SearchNode = function (x, y)
{
	function InRange (point, start, width)
	{
		return point >= start && point <= start + width;
	}
	
	var origX = TV.ScreenToModel (x, this.offset.x, this.scale);
	var origY = TV.ScreenToModel (y, this.offset.y, this.scale);
	var result = null;
	this.layout.EnumerateNodes (function (node) {
		if (result !== null) {
			return;
		}
		if (InRange (origX, node.position.x, node.size.x) && InRange (origY, node.position.y, node.size.y)) {
			result = node;
		}
	});
	return result;
};

TV.TreeViewer.prototype.OnMouseDown = function (x, y)
{
	this.mouse = new TV.Point (x, y);
	this.move = false;
};

TV.TreeViewer.prototype.OnMouseUp = function (x, y)
{
	if (!this.move) {
		var node = this.SearchNode (x, y);
		if (node !== null) {
			if (node.IsExpanded ()) {
				node.Collapse ();
			} else {
				node.Expand ();
			}
			this.CalculateLayout ();
		}
	}
	
	this.mouse = null;
	this.move = null;
};

TV.TreeViewer.prototype.OnMouseMove = function (x, y)
{
	if (this.mouse !== null) {
		this.offset.x += x - this.mouse.x;
		this.offset.y += y - this.mouse.y;
		this.mouse.Set (x, y);
		this.move = true;
		this.Update ();
	}
};

TV.TreeViewer.prototype.OnMouseWheel = function (x, y, delta)
{
	var oldScale = this.scale;
	var origX = TV.ScreenToModel (x, this.offset.x, this.scale);
	var origY = TV.ScreenToModel (y, this.offset.y, this.scale);
	
	if (delta > 0) {
		this.scale *= 1.1;
	} else {
		this.scale *= 0.9;
	}
	
	var scaleDiff = oldScale - this.scale;
	this.offset.x += origX * scaleDiff;
	this.offset.y += origY * scaleDiff;
	
	this.Update ();
};
