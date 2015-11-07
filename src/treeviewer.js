TV.TreeViewer = function (treeInterface)
{
	this.treeInterface = treeInterface;
	this.treeInterface.RegisterEvents ({
		onNodeClick : this.OnNodeClick.bind (this)
	});
	
	this.offset = new TV.Point (50, 200);
	this.layout = new TV.TreeLayout ();
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

TV.TreeViewer.prototype.Update = function (jsonData)
{
	var treeInterface = this.treeInterface;
	var offset = this.offset;
	this.layout.EnumerateNodes (function (node) {
		treeInterface.UpdateNode (node, offset);
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
