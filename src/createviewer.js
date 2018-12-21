TV.CreateCanvasViewer = function (canvas, styleParams)
{
	var style = new TV.DrawStyle (styleParams);
	var drawer = new TV.CanvasDrawer (canvas, style);
	return new TV.TreeViewer (drawer);	
};

TV.CreateSVGViewer = function (svg, styleParams)
{
	var style = new TV.DrawStyle (styleParams);
	var drawer = new TV.SVGDrawer (svg, style);
	return new TV.TreeViewer (drawer);	
};
