TV.TreeViewer = function (drawInterface)
{
	this.drawInterface = drawInterface;
	this.drawInterface.RegisterEvents ({
		onNodeClick : this.OnNodeClick.bind (this),
		onMouseDown : this.OnMouseDown.bind (this),
		onMouseUp : this.OnMouseUp.bind (this),
		onMouseMove : this.OnMouseMove.bind (this)
	});
	
	this.offset = new TV.Point (50, 200);
	this.layout = new TV.TreeLayout ();
	this.mouse = null;
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
	var offset = this.offset;
	this.layout.EnumerateNodes (function (node) {
		drawInterface.UpdateNode (node, offset);
	});
};

TV.TreeViewer.prototype.OnNodeClick = function (node)
{
	if (node.IsExpanded ()) {
		node.Collapse ();
	} else {
		node.Expand ();
	}
	this.CalculateLayout ();
};

TV.TreeViewer.prototype.OnMouseDown = function (x, y)
{
	this.mouse = new TV.Point (x, y);
};

TV.TreeViewer.prototype.OnMouseUp = function (x, y)
{
	this.mouse = null;
};

TV.TreeViewer.prototype.OnMouseMove = function (x, y)
{
	if (this.mouse !== null) {
		this.offset.x += x - this.mouse.x;
		this.offset.y += y - this.mouse.y;
		this.mouse.Set (x, y);
		this.Update ();
	}
};
