TV.TreeViewer = function (drawer)
{
	this.drawer = drawer;
	this.drawer.RegisterEvents ({
		onMouseDown : this.OnMouseDown.bind (this),
		onMouseUp : this.OnMouseUp.bind (this),
		onMouseMove : this.OnMouseMove.bind (this),
		onMouseWheel : this.OnMouseWheel.bind (this)
	});
	
	this.offset = new TV.Point (0, 0);
	this.scale = 1.0;
	this.layout = new TV.TreeLayout ();
	this.align = false;
	this.mouse = null;
	this.move = null;

	window.addEventListener ('resize', this.OnResize.bind (this), false);
};

TV.TreeViewer.prototype.LoadData = function (data)
{
	this.layout.LoadData (data);
	this.align = true;
};

TV.TreeViewer.prototype.EnumerateNodes = function (onFound)
{
	this.layout.EnumerateNodes (onFound);
};

TV.TreeViewer.prototype.SetNodesSize = function (width, height)
{
	this.layout.EnumerateNodes (function (node) {
		node.size.Set (width, height);
	});
};

TV.TreeViewer.prototype.SetNodesToAutomaticSize = function ()
{
	var drawer = this.drawer;
	this.layout.EnumerateNodes (function (node) {
		var size = drawer.GetNodeSize (node);
		node.size.Set (size.x + 20, size.y + 10);
	});
};

TV.TreeViewer.prototype.SetNodesToMaxSize = function ()
{
	var maxX = 0;
	var maxY = 0;
	var drawer = this.drawer;
	this.layout.EnumerateNodes (function (node) {
		var size = drawer.GetNodeSize (node);
		maxX = Math.max (size.x, maxX);
		maxY = Math.max (size.y, maxY);
	});
	this.layout.EnumerateNodes (function (node) {
		node.size.Set (maxX + 20, maxY + 10);
	});
};

TV.TreeViewer.prototype.Update = function ()
{
	this.layout.CalculateLayout ();
	if (this.align) {
		this.AutoAlign ();
		this.align = false;
	}
	this.Draw ();
};

TV.TreeViewer.prototype.AutoAlign = function ()
{
	var rootNode = this.layout.GetRootNode ();
	if (rootNode === null) {
		return;
	}
	
	var layoutBox = this.layout.GetLayoutBox ();
	var drawingSize = this.drawer.GetDrawingSize ();
	if (layoutBox.width < drawingSize.x) {
		this.offset.x = (drawingSize.x - layoutBox.width) / 2.0;
	} else {
		this.offset.x = 20;
	}
	this.offset.y = (drawingSize.y - layoutBox.height) / 2.0 - layoutBox.y;
};

TV.TreeViewer.prototype.GetLayout = function ()
{
	return this.layout;
};

TV.TreeViewer.prototype.Draw = function ()
{
	var drawer = this.drawer;
	drawer.DrawStart ();
	
	var offset = this.offset;
	var scale = this.scale;
	this.layout.EnumerateVisibleNodes (function (node) {
		drawer.DrawNode (node, offset, scale);
	});
	
	drawer.DrawEnd ();
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
	this.layout.EnumerateVisibleNodes (function (node) {
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
			this.Update ();
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
		this.Draw ();
	}
};

TV.TreeViewer.prototype.OnMouseWheel = function (x, y, delta)
{
	var newScale = this.scale;
	if (delta > 0) {
		newScale *= 1.1;
	} else {
		newScale *= 0.9;
	}
	
	if (newScale < 0.1 || newScale > 10.0) {
		return;
	}
	
	var scaleDiff = this.scale - newScale;
	var origX = TV.ScreenToModel (x, this.offset.x, this.scale);
	var origY = TV.ScreenToModel (y, this.offset.y, this.scale);
	this.offset.x += origX * scaleDiff;
	this.offset.y += origY * scaleDiff;
	this.scale = newScale;
	
	this.Draw ();
};

TV.TreeViewer.prototype.OnResize = function ()
{
	this.Draw ();
};
