TV.CanvasDrawer = function (canvas, style)
{
	this.canvas = canvas;
	this.context = canvas.getContext ('2d');
	this.context.translate (0.5, 0.5);
	this.style = style;
	this.events = null;
};

TV.CanvasDrawer.prototype.RegisterEvents = function (events)
{
	this.events = events;
	this.canvas.addEventListener ('mousedown', this.OnMouseDown.bind (this), false);
	document.addEventListener ('mouseup', this.OnMouseUp.bind (this), false);
	document.addEventListener ('mousemove', this.OnMouseMove.bind (this), false);
	this.canvas.addEventListener ('DOMMouseScroll', this.OnMouseWheel.bind (this), false);
	this.canvas.addEventListener ('mousewheel', this.OnMouseWheel.bind (this), false);
};

TV.CanvasDrawer.prototype.GetDrawingSize = function (node)
{
	var result = new TV.Point (this.canvas.width, this.canvas.height);
	return result;
};

TV.CanvasDrawer.prototype.GetNodeSize = function (node)
{
	var fontSize = this.style.GetFontSize (1.0);
	var fontFamily = this.style.GetFontFamily ();
	this.context.font = fontSize + 'px ' + fontFamily;
	var textSize = this.context.measureText (node.GetText ());
	var result = new TV.Point (textSize.width, fontSize);
	return result;
};

TV.CanvasDrawer.prototype.DrawStart = function ()
{
	this.context.clearRect (0, 0, this.canvas.width, this.canvas.height);
	this.context.fillStyle = '#ffffff';
	this.context.fillRect (0, 0, this.canvas.width, this.canvas.height);
};

TV.CanvasDrawer.prototype.DrawEnd = function ()
{

};

TV.CanvasDrawer.prototype.DrawNode = function (node, offset, scale)
{
	function GetValue (original, offset, scale)
	{
		var result = TV.ModelToScreen (original, offset || 0.0, scale || 1.0);
		return Math.round (result);
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
	var fontSize = this.style.GetFontSize (scale);
	var fontFamily = this.style.GetFontFamily ();
	
	this.context.font = fontSize + 'px ' + fontFamily;
	this.context.fillStyle = this.style.GetTextColor (node);
	this.context.textAlign = 'center';
	this.context.textBaseline = 'middle';
	var textX = position.x + size.x / 2;
	var textY = position.y + size.y / 2 + 1;
	this.context.fillText (nodeText, GetValue (textX, offset.x, scale), GetValue (textY, offset.y, scale));
};

TV.CanvasDrawer.prototype.OnMouseDown = function (event)
{
	var eventParameters = event || window.event;
	eventParameters.preventDefault ();
	var mousePosition = this.CalcMousePosition (eventParameters.clientX, eventParameters.clientY);
	this.events.onMouseDown (mousePosition.x, mousePosition.y);
};

TV.CanvasDrawer.prototype.OnMouseUp = function (event)
{
	var eventParameters = event || window.event;
	eventParameters.preventDefault ();
	var mousePosition = this.CalcMousePosition (eventParameters.clientX, eventParameters.clientY);
	this.events.onMouseUp (mousePosition.x, mousePosition.y);
};

TV.CanvasDrawer.prototype.OnMouseMove = function (event)
{
	var eventParameters = event || window.event;
	eventParameters.preventDefault ();
	var mousePosition = this.CalcMousePosition (eventParameters.clientX, eventParameters.clientY);
	this.events.onMouseMove (mousePosition.x, mousePosition.y);
};

TV.CanvasDrawer.prototype.OnMouseWheel = function (event)
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

TV.CanvasDrawer.prototype.CalcMousePosition = function (origX, origY)
{
	return new TV.Point (
		origX - (this.canvas.offsetLeft - window.scrollX),
		origY - (this.canvas.offsetTop - window.scrollY)
	);
};
