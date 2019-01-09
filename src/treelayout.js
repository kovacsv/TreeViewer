TV.TreeLayout = function ()
{
	this.nodeId = 0;
	this.rootNode = null;
	
	this.dimensions = {
		defaultNodeWidth : 100,
		defaultNodeHeight : 25,
		nodeHorizontalSpace : 50,
		nodeVerticalSpace : 20
	};
};

TV.TreeLayout.prototype.LoadData = function (data)
{
	function LoadNode (tree, data, parent)
	{
		var node = tree.AddNode (data, parent);
		var children = data.children;
		if (children !== undefined) {
			var i;
			for (i = 0; i < children.length; i++) {
				LoadNode (tree, children[i], node);
			}
		}
		return node;
	}

	LoadNode (this, data, null);
};

TV.TreeLayout.prototype.AddNode = function (data, parent)
{
	var node = new TV.TreeNode (this.nodeId, data.text, parent);
	this.nodeId += 1;

	var width = this.dimensions.defaultNodeWidth;
	var height = this.dimensions.defaultNodeHeight;
	node.SetPosition (0, 0);
	node.SetSize (width, height);

	if (parent === null) {
		this.rootNode = node;
	}
	return node;
};

TV.TreeLayout.prototype.GetRootNode = function ()
{
	return this.rootNode;
};

TV.TreeLayout.prototype.SetNodeSpacing = function (horizontal, vertical)
{
	this.dimensions.nodeHorizontalSpace = horizontal;
	this.dimensions.nodeVerticalSpace = vertical;
};

TV.TreeLayout.prototype.CalculateLayout = function ()
{
	function CalculateChildrenPosition (node, dimensions, treeData)
	{
		function GetVerticalHeight (node, dimensions, verticalHeightCache)
		{
			if (verticalHeightCache[node.id] !== undefined) {
				return verticalHeightCache[node.id];
			}

			var height = 0;
			var count = 0;
			node.EnumerateVisibleChildren (function (child) {
				height += GetVerticalHeight (child, dimensions, verticalHeightCache);
				height += dimensions.nodeVerticalSpace;
				count += 1;
			});
			
			if (count !== 0) {
				height -= dimensions.nodeVerticalSpace;
			} else {
				height = node.size.y;
			}

			verticalHeightCache[node.id] = height;
			return height;
		}			

		var fullHeight = GetVerticalHeight (node, dimensions, treeData.verticalHeightCache);
		var offset = -fullHeight / 2.0 + node.size.y / 2.0;

		node.EnumerateVisibleChildren (function (child) {
			var verticalHeight = GetVerticalHeight (child, dimensions, treeData.verticalHeightCache);
			child.position.x = node.position.x + node.size.x + dimensions.nodeHorizontalSpace;
			child.position.y = node.position.y + offset + (verticalHeight - node.size.y) / 2.0;
			offset += verticalHeight + dimensions.nodeVerticalSpace;
		});
	}

	if (this.rootNode === null) {
		return;
	}

	var tree = this;
	var treeData = {
		verticalHeightCache : {}
	};
	
	this.EnumerateVisibleNodes (function (node) {
		CalculateChildrenPosition (node, tree.dimensions, treeData);
	});
};

TV.TreeLayout.prototype.GetLayoutBox = function ()
{
	var min = new TV.Point (0, 0);
	var max = new TV.Point (0, 0);
	this.EnumerateVisibleNodes (function (node) {
		min.x = Math.min (node.position.x, min.x);
		min.y = Math.min (node.position.y, min.y);
		max.x = Math.max (node.position.x + node.size.x, max.x);
		max.y = Math.max (node.position.y + node.size.y, max.y);
	});
	var xDiff = Math.abs (max.x - min.x);
	var yDiff = Math.abs (max.y - min.y);
	var result = {
		x : min.x,
		y : min.y,
		width : xDiff,
		height : yDiff
	};
	return result;
};

TV.TreeLayout.prototype.EnumerateNodes = function (onFound)
{
	function EnumerateNode (node, onFound)
	{
		onFound (node);
		node.EnumerateChildren (function (child) {
			EnumerateNode (child, onFound);
		});
	}

	if (this.rootNode !== null) {
		EnumerateNode (this.rootNode, onFound);
	}
};

TV.TreeLayout.prototype.EnumerateVisibleNodes = function (onFound)
{
	function EnumerateNode (node, onFound)
	{
		onFound (node);
		node.EnumerateVisibleChildren (function (child) {
			EnumerateNode (child, onFound);
		});
	}

	if (this.rootNode !== null) {
		EnumerateNode (this.rootNode, onFound);
	}
};
