TV.TreeNode = function (id, text, parent)
{
	this.id = id;
	this.text = text;
	
	this.parent = parent;
	this.children = [];
	if (this.parent !== null) {
		this.parent.children.push (this);
	}

	this.position = new TV.Point (0, 0);
	this.size = new TV.Point (0, 0);
	this.expanded = true;
};

TV.TreeNode.prototype.GetId = function ()
{
	return this.id;
};

TV.TreeNode.prototype.GetText = function ()
{
	return this.text;
};

TV.TreeNode.prototype.HasParent = function ()
{
	return this.parent !== null;
};

TV.TreeNode.prototype.GetParent = function ()
{
	return this.parent;
};

TV.TreeNode.prototype.HasChild = function ()
{
	return this.children.length !== 0;
};

TV.TreeNode.prototype.GetPosition = function ()
{
	return this.position;
};

TV.TreeNode.prototype.GetSize = function ()
{
	return this.size;
};

TV.TreeNode.prototype.IsExpanded = function ()
{
	return this.expanded;
};

TV.TreeNode.prototype.IsCollapsed = function ()
{
	return !this.expanded;
};

TV.TreeNode.prototype.Expand = function ()
{
	this.expanded = true;
};

TV.TreeNode.prototype.Collapse = function ()
{
	this.expanded = false;
};

TV.TreeNode.prototype.EnumerateChildren = function (onFound)
{
	var i, child;
	for (i = 0; i < this.children.length; i++) {
		child = this.children[i];
		onFound (child);
	}
};

TV.TreeNode.prototype.EnumerateChildrenRecursive = function (onFound)
{
	var i, child;
	for (i = 0; i < this.children.length; i++) {
		child = this.children[i];
		onFound (child);
		child.EnumerateChildrenRecursive (onFound);
	}
};

TV.TreeNode.prototype.EnumerateVisibleChildren = function (onFound)
{
	if (!this.expanded) {
		return
	}
	this.EnumerateChildren (onFound);
};

TV.TreeNode.prototype.GetRightAnchor = function ()
{
	var x = this.position.x + this.size.x;
	var y = this.position.y + this.size.y / 2;
	return new TV.Point (x, y);
};		

TV.TreeNode.prototype.GetLeftAnchor = function (position)
{
	var x = this.position.x;
	var y = this.position.y + this.size.y / 2;
	return new TV.Point (x, y);
};
