TV.CreateCanvasViewer = function (canvas, style, callbacks)
{
	var drawStyle = new TV.DrawStyle (style);
	var drawer = new TV.CanvasDrawer (canvas, drawStyle);
	return new TV.TreeViewer (drawer, callbacks);
};

TV.CreateSVGViewer = function (svg, style, callbacks)
{
	var drawStyle = new TV.DrawStyle (style);
	var drawer = new TV.SVGDrawer (svg, drawStyle);
	return new TV.TreeViewer (drawer, callbacks);	
};
