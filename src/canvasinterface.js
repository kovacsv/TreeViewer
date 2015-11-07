TV.CanvasInterface = function (canvas)
{
	this.canvas = canvas;
	this.context = canvas.getContext ('2d');
	this.context.translate (0.5, 0.5);
	this.events = null;
	this.style = {
		fontSize : 12,
		strokeWidth : 1
	};
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
	this.context.beginPath ();
};

TV.CanvasInterface.prototype.UpdateEnd = function ()
{
	this.context.stroke ();
};

TV.CanvasInterface.prototype.UpdateNode = function (node, offset, scale)
{
	function GetValue (original, offset, scale)
	{
		var result = TV.ModelToScreen (original, offset || 0.0, scale || 1.0);
		return parseInt (result, 10);
	}
	
	var position = node.GetPosition ();
	var size = node.GetSize ();

	this.context.lineWidth = GetValue (this.style.strokeWidth, null, scale);
	this.context.rect (
		GetValue (position.x, offset.x, scale),
		GetValue (position.y, offset.y, scale),
		GetValue (size.x, null, scale),
		GetValue (size.y, null, scale)
	);

	if (node.HasParent ()) {
		var start = node.GetParent ().GetRightAnchor ();
		var end = node.GetLeftAnchor ();
		this.context.moveTo (GetValue (start.x, offset.x, scale), GetValue (start.y, offset.y, scale));
		this.context.lineTo (GetValue (end.x, offset.x, scale), GetValue (end.y, offset.y, scale));
	}

	var nodeText = node.GetText ();
	var fontSize = GetValue (this.style.fontSize, null, scale);

	this.context.fillStyle = '#000000';
	this.context.textAlign = 'center';
	this.context.textBaseline = 'middle';
	var textX = position.x + size.x / 2;
	var textY = position.y + size.y / 2;
	this.context.font = fontSize + 'px arial';
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
