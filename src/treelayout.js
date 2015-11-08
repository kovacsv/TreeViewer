TV.TreeLayout = function ()
{
	this.nodeId = 0;
	this.rootNode = null;
	
	this.dimensions = {
		defaultNodeWidth : 100,
		defaultNodeHeight : 25,
		verticalPadding : 20,
		horizontalPadding : 50
	};
};

TV.TreeLayout.prototype.LoadData = function (data)
{
	function LoadNode (tree, data, parent)
	{
		var node = new TV.TreeNode (tree.nodeId, data.text, parent);
		node.position.Set (0, 0);
		node.size.Set (100, 25);
		tree.nodeId += 1;

		var children = data.children;
		if (children !== undefined) {
			var i;
			for (i = 0; i < children.length; i++) {
				LoadNode (tree, children[i], node);
			}
		}
		
		return node;
	}

	this.rootNode = LoadNode (this, data, null);
	var width = this.dimensions.defaultNodeWidth;
	var height = this.dimensions.defaultNodeHeight;
	this.EnumerateNodes (function (node) {
		node.size.Set (width, height);
	});	
};

TV.TreeLayout.prototype.GetRootNode = function ()
{
	return this.rootNode;
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
				height += dimensions.verticalPadding;
				count += 1;
			});
			
			if (count !== 0) {
				height -= dimensions.verticalPadding;
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
			child.position.x = node.position.x + node.size.x + dimensions.horizontalPadding;
			child.position.y = node.position.y + offset + (verticalHeight - node.size.y) / 2.0;
			offset += verticalHeight + dimensions.verticalPadding;
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

TV.TreeLayout.prototype.GetLayoutSize = function ()
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
	var result = new TV.Point (xDiff, yDiff);
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
