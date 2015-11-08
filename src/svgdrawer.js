TV.SVGDrawer = function (svg, style)
{
	this.svg = svg;
	this.svgNodes = {};
	this.svg.setAttributeNS (null, 'transform', 'translate(0.5,0.5)');
	this.style = style;
	this.events = null;
};

TV.SVGDrawer.prototype.RegisterEvents = function (events)
{
	this.events = events;
	this.svg.addEventListener ('mousedown', this.OnMouseDown.bind (this), false);
	document.addEventListener ('mouseup', this.OnMouseUp.bind (this), false);
	document.addEventListener ('mousemove', this.OnMouseMove.bind (this), false);
	this.svg.addEventListener ('DOMMouseScroll', this.OnMouseWheel.bind (this), false);
	this.svg.addEventListener ('mousewheel', this.OnMouseWheel.bind (this), false);
};

TV.SVGDrawer.prototype.SetNodesAutomaticSize = function (nodeEnumerator)
{
	var fontSize = this.style.GetFontSize (1.0);
	var fontFamily = this.style.GetFontFamily ();
	
	var svgNamespace = 'http://www.w3.org/2000/svg';
	var measureText = document.createElementNS (svgNamespace, 'text');
	measureText.setAttributeNS (null, 'text-anchor', 'middle');
	measureText.setAttributeNS (null, 'dominant-baseline', 'central');

	measureText.setAttributeNS (null, 'font-size', fontSize + 'px');
	measureText.setAttributeNS (null, 'font-family', fontFamily);

	this.svg.appendChild (measureText);
	nodeEnumerator (function (node) {
		measureText.textContent = node.GetText ();
		var textSize = measureText.getBBox ();
		node.size.x = textSize.width + 30;
		node.size.y = fontSize * 2;
	});
	this.svg.removeChild (measureText);
};

TV.SVGDrawer.prototype.DrawStart = function ()
{

};

TV.SVGDrawer.prototype.DrawEnd = function ()
{

};

TV.SVGDrawer.prototype.DrawNode = function (node, offset, scale)
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
	}

	function GetValue (original, offset, scale)
	{
		var result = TV.ModelToScreen (original, offset || 0.0, scale || 1.0);
		return parseInt (result, 10);
	}

	if (node.IsCollapsed ()) {
		var svg = this.svg;
		var svgNodes = this.svgNodes;
		node.EnumerateChildrenRecursive (function (child) {
			DeleteNode (child, svg, svgNodes);
		});
	}
	
	var nodeId = node.GetId ();
	var svgNode = this.svgNodes[nodeId];
	if (svgNode === undefined || svgNode === null) {
		svgNode = this.CreateNode (node);
	}
	
	var className = node.HasChild () ? 'haschild' : 'nochild';
	var position = node.GetPosition ();
	var size = node.GetSize ();

	var lineWidth = Math.max (this.style.GetLineWidth (scale), 1.0);
	var fontSize = this.style.GetFontSize (scale);
	var fontFamily = this.style.GetFontFamily ();
	
	svgNode.rect.setAttributeNS (null, 'x', GetValue (position.x, offset.x, scale));
	svgNode.rect.setAttributeNS (null, 'y', GetValue (position.y, offset.y, scale));
	svgNode.rect.setAttributeNS (null, 'width', GetValue (size.x, null, scale));
	svgNode.rect.setAttributeNS (null, 'height', GetValue (size.y, null, scale));
	svgNode.rect.setAttributeNS (null, 'stroke', this.style.GetRectColor (node));
	svgNode.rect.setAttributeNS (null, 'fill', this.style.GetNodeColor (node));
	svgNode.rect.setAttributeNS (null, 'stroke-width', lineWidth);

	if (node.HasParent ()) {
		var start = node.GetParent ().GetRightAnchor ();
		var end = node.GetLeftAnchor ();
		svgNode.line.setAttributeNS (null, 'x1', GetValue (start.x, offset.x, scale));
		svgNode.line.setAttributeNS (null, 'y1', GetValue (start.y, offset.y, scale));
		svgNode.line.setAttributeNS (null, 'x2', GetValue (end.x, offset.x, scale));
		svgNode.line.setAttributeNS (null, 'y2', GetValue (end.y, offset.y, scale));
		svgNode.line.setAttributeNS (null, 'stroke', this.style.GetLineColor ());
		svgNode.line.setAttributeNS (null, 'stroke-width', lineWidth);
	}

	var textX = position.x + size.x / 2;
	var textY = position.y + size.y / 2;
	svgNode.text.setAttributeNS (null, 'x', GetValue (textX, offset.x, scale));
	svgNode.text.setAttributeNS (null, 'y', GetValue (textY, offset.y, scale));
	svgNode.text.setAttributeNS (null, 'fill', this.style.GetTextColor (node));
	svgNode.text.setAttributeNS (null, 'font-size', fontSize + 'px');
	svgNode.text.setAttributeNS (null, 'font-family', fontFamily);
};

TV.SVGDrawer.prototype.CreateNode = function (node)
{
	var nodeId = node.GetId ();
	var svgNode = {
		rect : null,
		text : null,
		line : null
	};
	
	var svgNamespace = 'http://www.w3.org/2000/svg';
	svgNode.rect = document.createElementNS (svgNamespace, 'rect');
	svgNode.rect.setAttributeNS (null, 'shape-rendering', 'crispEdges');
	this.svg.appendChild (svgNode.rect);
	
	if (node.HasParent ()) {
		svgNode.line = document.createElementNS (svgNamespace, 'line');
		this.svg.appendChild (svgNode.line);
	}

	svgNode.text = document.createElementNS (svgNamespace, 'text');
	svgNode.text.setAttributeNS (null, 'text-anchor', 'middle');
	svgNode.text.setAttributeNS (null, 'dominant-baseline', 'central');
	svgNode.text.textContent = node.GetText ();
	this.svg.appendChild (svgNode.text);
	
	this.svgNodes[nodeId] = svgNode;
	return svgNode;
};

TV.SVGDrawer.prototype.OnMouseDown = function (event)
{
	var eventParameters = event || window.event;
	eventParameters.preventDefault ();
	var mousePosition = this.CalcMousePosition (eventParameters.clientX, eventParameters.clientY);
	this.events.onMouseDown (mousePosition.x, mousePosition.y);
};

TV.SVGDrawer.prototype.OnMouseUp = function (event)
{
	var eventParameters = event || window.event;
	eventParameters.preventDefault ();
	var mousePosition = this.CalcMousePosition (eventParameters.clientX, eventParameters.clientY);
	this.events.onMouseUp (mousePosition.x, mousePosition.y);
};

TV.SVGDrawer.prototype.OnMouseMove = function (event)
{
	var eventParameters = event || window.event;
	eventParameters.preventDefault ();
	var mousePosition = this.CalcMousePosition (eventParameters.clientX, eventParameters.clientY);
	this.events.onMouseMove (mousePosition.x, mousePosition.y);
};

TV.SVGDrawer.prototype.OnMouseWheel = function (event)
{
	var eventParameters = event || window.event;
	eventParameters.preventDefault ();
	var delta = 0;
	if (eventParameters.detail) {
		delta = -eventParameters.detail;
	} else if (eventParameters.wheelDelta) {
		delta = eventParameters.wheelDelta / 40;
	}
	var mousePosition = this.CalcMousePosition (eventParameters.clientX, eventParameters.clientY);
	this.events.onMouseWheel (mousePosition.x, mousePosition.y, delta);
};

TV.SVGDrawer.prototype.CalcMousePosition = function (origX, origY)
{
	var boundingRect = this.svg.getBoundingClientRect ();
	return new TV.Point (
		origX - boundingRect.left,
		origY - boundingRect.top
	);
};
