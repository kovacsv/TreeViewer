TV.SVGInterface = function (svg)
{
	this.svg = svg;
	this.svgNodes = {};
	this.svg.setAttributeNS (null, 'transform', 'translate(0.5,0.5)');
	this.events = null;
};

TV.SVGInterface.prototype.RegisterEvents = function (events)
{
	this.events = events;
	//document.addEventListener ('mousemove', function (event) {});
	//document.addEventListener ('mouseup', function (event) {});
	//this.svg.addEventListener ('mousedown', function (event) {alert ('down');}, false);
};

TV.SVGInterface.prototype.UpdateNode = function (node, offset)
{
	var nodeId = node.GetId ();
	var svgNode = this.svgNodes[nodeId];
	if (svgNode === undefined || svgNode === null) {
		svgNode = this.CreateNode (node);
	}
	
	var className = node.HasChild () ? 'haschild' : 'nochild';
	var position = node.GetPosition ();
	var size = node.GetSize ();
	
	svgNode.rect.setAttributeNS (null, 'x', parseInt (position.x + offset.x, 10));
	svgNode.rect.setAttributeNS (null, 'y', parseInt (position.y + offset.y, 10));
	svgNode.rect.setAttributeNS (null, 'width', parseInt (size.x, 10));
	svgNode.rect.setAttributeNS (null, 'height', parseInt (size.y, 10));
	svgNode.rect.setAttributeNS (null, 'class', className);
	
	var textBox = svgNode.text.getBBox ();
	var textX = position.x + size.x / 2;
	var textY = position.y + (size.y + textBox.height / 2) / 2;
	svgNode.text.setAttributeNS (null, 'x', parseInt (textX + offset.x, 10));
	svgNode.text.setAttributeNS (null, 'y', parseInt (textY + offset.y, 10));
	svgNode.text.setAttributeNS (null, 'class', className);

	if (node.HasParent ()) {
		var start = node.GetParent ().GetRightAnchor ();
		var end = node.GetLeftAnchor ();
		svgNode.line.setAttributeNS (null, 'x1', parseInt (start.x + offset.x, 10));
		svgNode.line.setAttributeNS (null, 'y1', parseInt (start.y + offset.y, 10));
		svgNode.line.setAttributeNS (null, 'x2', parseInt (end.x + offset.x, 10));
		svgNode.line.setAttributeNS (null, 'y2', parseInt (end.y + offset.y, 10));
	}
};

TV.SVGInterface.prototype.CreateNode = function (node)
{
	var nodeId = node.GetId ();
	var svgNode = {
		rect : null,
		text : null,
		line : null
	};
	
	var svgNamespace = 'http://www.w3.org/2000/svg';
	if (node.HasParent ()) {
		svgNode.line = document.createElementNS (svgNamespace, 'line');
		svgNode.line.setAttributeNS (null, 'stroke', 'black');
		this.svg.appendChild (svgNode.line);
	}

	svgNode.rect = document.createElementNS (svgNamespace, 'rect');
	svgNode.rect.setAttributeNS (null, 'stroke', 'black');
	svgNode.rect.setAttributeNS (null, 'fill', 'white');
	this.svg.appendChild (svgNode.rect);
	
	svgNode.text = document.createElementNS (svgNamespace, 'text');
	svgNode.text.setAttributeNS (null, 'fill', 'black');
	svgNode.text.setAttributeNS (null, 'font-size', '15px');
	svgNode.text.setAttributeNS (null, 'font-family', 'arial, cursive');
	svgNode.text.setAttributeNS (null, 'text-anchor', 'middle');
	svgNode.text.setAttributeNS (null, 'alignment-baseline', 'middle');
	svgNode.text.textContent = node.GetText ()
	this.svg.appendChild (svgNode.text);
	
	this.svgNodes[nodeId] = svgNode;
	if (this.events !== null) {
		var myThis = this;
		svgNode.rect.addEventListener ('click', function (event) { myThis.OnNodeClick (node); }, false);
		svgNode.text.addEventListener ('click', function (event) { myThis.OnNodeClick (node); }, false);
	}

	return svgNode;
};

TV.SVGInterface.prototype.OnNodeClick = function (node)
{
	function DeleteNode (node, svg, svgNodes)
	{
		var nodeId = node.GetId ();
		var svgNode = svgNodes[nodeId];
		if (svgNode !== undefined && svgNode !== null) {
			svgNodes[nodeId] = null;
			svg.removeChild (svgNode.rect);
			svg.removeChild (svgNode.text);
			svg.removeChild (svgNode.line);
		}
	};

	this.events.onNodeClick (node);
	if (node.IsCollapsed ()) {
		var svg = this.svg;
		var svgNodes = this.svgNodes;
		node.EnumerateChildrenRecursive (function (child) {
			DeleteNode (child, svg, svgNodes);
		});		
	}
};
