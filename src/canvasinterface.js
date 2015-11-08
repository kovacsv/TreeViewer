TV.CanvasInterface = function (canvas, style)
{
	this.canvas = canvas;
	this.context = canvas.getContext ('2d');
	this.context.translate (0.5, 0.5);
	this.style = style;
	this.events = null;
	this.visibility = null;
};

TV.CanvasInterface.prototype.RegisterEvents = function (events)
{
	this.events = events;
	this.canvas.addEventListener ('mousedown', this.OnMouseDown.bind (this), false);
	document.addEventListener ('mouseup', this.OnMouseUp.bind (this), false);
	document.addEventListener ('mousemove', this.OnMouseMove.bind (this), false);
	this.canvas.addEventListener ('DOMMouseScroll', this.OnMouseWheel.bind (this), false);
	this.canvas.addEventListener ('mousewheel', this.OnMouseWheel.bind (this), false);
};

TV.CanvasInterface.prototype.UpdateStart = function ()
{
	this.context.clearRect (0, 0, this.canvas.width, this.canvas.height);
	this.context.fillStyle = '#ffffff';
	this.context.fillRect (0, 0, this.canvas.width, this.canvas.height);
	this.visibility = {};
};

TV.CanvasInterface.prototype.UpdateEnd = function ()
{
	this.visibility = null;
};

TV.CanvasInterface.prototype.UpdateNode = function (node, offset, scale)
{
	function GetValue (original, offset, scale)
	{
		var result = TV.ModelToScreen (original, offset || 0.0, scale || 1.0);
		return Math.round (result);
	}

	function IsVisible (node, width, height, visibility)
	{
		function IsVisibleNode (node, width, height, offset, scale, visibility)
		{
			if (node === null) {
				return false;
			}
			
			var nodeId = node.GetId ();
			if (visibility[nodeId] !== undefined) {
				return visibility[nodeId];
			}
			
			var position = node.GetPosition ();
			var size = node.GetSize ();
			
			var rectX = GetValue (position.x, offset.x, scale);
			var rectY = GetValue (position.y, offset.y, scale);
			var rectWidth = GetValue (size.x, null, scale);
			var rectHeight = GetValue (size.y, null, scale);		
			
			var visible = true;
			if (rectX > width || rectY > height) {
				visible = false;
			} else if (rectX + rectWidth < 0 || rectY + rectHeight < 0) {
				visible = false;
			}
			visibility[nodeId] = visible;
			return visible;
		}
		
		var visible = IsVisibleNode (node, width, height, offset, scale, visibility);
		var parentVisible = IsVisibleNode (node.GetParent (), width, height, offset, scale, visibility);
		return visible || parentVisible;
	}
		
	if (!IsVisible (node, this.canvas.width, this.canvas.height, this.visibility)) {
		return;
	}
	
	var position = node.GetPosition ();
	var size = node.GetSize ();

	var rectX = GetValue (position.x, offset.x, scale);
	var rectY = GetValue (position.y, offset.y, scale);
	var rectWidth = GetValue (size.x, null, scale);
	var rectHeight = GetValue (size.y, null, scale);
	
	this.context.beginPath ();
	this.context.fillStyle = this.style.GetNodeColor (node);
	this.context.fillRect (rectX, rectY, rectWidth, rectHeight);
	this.context.lineWidth = this.style.GetLineWidth (scale);
	this.context.strokeStyle = this.style.GetRectColor (node);
	this.context.rect (rectX, rectY, rectWidth, rectHeight);
	this.context.stroke ();

	if (node.HasParent ()) {
		this.context.beginPath ();
		var start = node.GetParent ().GetRightAnchor ();
		var end = node.GetLeftAnchor ();
		this.context.strokeStyle = this.style.GetLineColor (node);
		this.context.moveTo (GetValue (start.x, offset.x, scale), GetValue (start.y, offset.y, scale));
		this.context.lineTo (GetValue (end.x, offset.x, scale), GetValue (end.y, offset.y, scale));
		this.context.stroke ();
	}

	var nodeText = node.GetText ();
	this.context.fillStyle = this.style.GetTextColor (node);
	this.context.textAlign = 'center';
	this.context.textBaseline = 'middle';
	var textX = position.x + size.x / 2;
	var textY = position.y + size.y / 2 + 1;
	this.context.font = this.style.GetFontSize (scale) + 'px ' + this.style.GetFontFamily ();
	this.context.fillText (nodeText, GetValue (textX, offset.x, scale), GetValue (textY, offset.y, scale));
};

TV.CanvasInterface.prototype.OnMouseDown = function (event)
{
	var eventParameters = event || window.event;
	eventParameters.preventDefault ();
	var mousePosition = this.CalcMousePosition (eventParameters.clientX, eventParameters.clientY);
	this.events.onMouseDown (mousePosition.x, mousePosition.y);
};

TV.CanvasInterface.prototype.OnMouseUp = function (event)
{
	var eventParameters = event || window.event;
	eventParameters.preventDefault ();
	var mousePosition = this.CalcMousePosition (eventParameters.clientX, eventParameters.clientY);
	this.events.onMouseUp (mousePosition.x, mousePosition.y);
};

TV.CanvasInterface.prototype.OnMouseMove = function (event)
{
	var eventParameters = event || window.event;
	eventParameters.preventDefault ();
	var mousePosition = this.CalcMousePosition (eventParameters.clientX, eventParameters.clientY);
	this.events.onMouseMove (mousePosition.x, mousePosition.y);
};

TV.CanvasInterface.prototype.OnMouseWheel = function (event)
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

TV.CanvasInterface.prototype.CalcMousePosition = function (origX, origY)
{
	return new TV.Point (
		origX - this.canvas.offsetLeft,
		origY - this.canvas.offsetTop
	);
};
