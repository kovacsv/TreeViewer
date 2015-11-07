TV.TreeLayout = function ()
{
	this.nodeId = 0;
	this.rootNode = null;
	
	this.dimensions = {
		nodeWidth : 100,
		nodeHeight : 25,
		verticalPadding : 20,
		horizontalPadding : 50
	};
};

TV.TreeLayout.prototype.LoadJson = function (jsonData)
{
	function LoadNode (tree, data, parent)
	{
		var node = new TV.TreeNode (tree.nodeId, data.text, parent);
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

	this.rootNode = LoadNode (this, jsonData, null);
};

TV.TreeLayout.prototype.CalculateLayout = function ()
{
	function CalculateNodeSize (node, dimensions)
	{
		node.size.x = dimensions.nodeWidth;
		node.size.y = dimensions.nodeHeight;
	}

	function CalculateChildrenPosition (node, dimensions, treeData)
	{
		function CountMaxVerticalNodes (node, maxVerticalNodeCache)
		{
			if (maxVerticalNodeCache[node.id] !== undefined) {
				return maxVerticalNodeCache[node.id];
			}

			var count = 0;
			node.EnumerateVisibleChildren (function (child) {
				count += CountMaxVerticalNodes (child, maxVerticalNodeCache);
			});
			if (count === 0) {
				count = 1;
			}

			maxVerticalNodeCache[node.id] = count;
			return count;
		}			
	
		function GetHeightByNodeCount (nodeCount, dimensions)
		{
			return nodeCount * dimensions.nodeHeight + (nodeCount - 1) * dimensions.verticalPadding;
		}
		
		var fullVerticalNodeCount = CountMaxVerticalNodes (node, treeData.maxVerticalNodeCache);
		var fullHeight = GetHeightByNodeCount (fullVerticalNodeCount, dimensions);
		var offset = -fullHeight / 2 + dimensions.nodeHeight / 2;
		
		node.EnumerateVisibleChildren (function (child) {
			var verticalNodes = CountMaxVerticalNodes (child, treeData.maxVerticalNodeCache);
			var verticalHeight = GetHeightByNodeCount (verticalNodes, dimensions);
			child.position.x = node.position.x + node.size.x + dimensions.horizontalPadding;
			child.position.y = node.position.y + offset + (verticalHeight - node.size.y) / 2;
			offset += verticalHeight + dimensions.verticalPadding;
		});
	}

	if (this.rootNode === null) {
		return;
	}

	var tree = this;
	var treeData = {
		maxVerticalNodeCache : {}
	};
	
	this.EnumerateNodes (function (node) {

	});		
	
	this.EnumerateNodes (function (node) {
		CalculateNodeSize (node, tree.dimensions);
		CalculateChildrenPosition (node, tree.dimensions, treeData);
	});			
};

TV.TreeLayout.prototype.EnumerateNodes = function (onFound)
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
