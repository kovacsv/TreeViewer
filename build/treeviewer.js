'use strict';var TV=function(){this.mainVersion=0;this.subVersion=1};TV.CopyObjectProperties=function(a,b){if(!(void 0===a||null===a))for(var c in a)a.hasOwnProperty(c)&&(b[c]=a[c])};TV.ModelToScreen=function(a,b,c){return a*c+b};TV.ScreenToModel=function(a,b,c){return(a-b)/c};TV.Point=function(a,b){this.x=a;this.y=b};TV.Point.prototype.Set=function(a,b){this.x=a;this.y=b};
TV.TreeNode=function(a,b,c){this.id=a;this.text=b;this.parent=c;this.children=[];null!==this.parent&&this.parent.children.push(this);this.position=new TV.Point(0,0);this.size=new TV.Point(0,0);this.expanded=!0};TV.TreeNode.prototype.GetId=function(){return this.id};TV.TreeNode.prototype.GetText=function(){return this.text};TV.TreeNode.prototype.HasParent=function(){return null!==this.parent};TV.TreeNode.prototype.GetParent=function(){return this.parent};
TV.TreeNode.prototype.HasChild=function(){return 0!==this.children.length};TV.TreeNode.prototype.GetPosition=function(){return this.position};TV.TreeNode.prototype.SetPosition=function(a,b){this.position.Set(a,b)};TV.TreeNode.prototype.GetSize=function(){return this.size};TV.TreeNode.prototype.SetSize=function(a,b){this.size.Set(a,b)};TV.TreeNode.prototype.IsExpanded=function(){return this.expanded};TV.TreeNode.prototype.IsCollapsed=function(){return!this.expanded};
TV.TreeNode.prototype.Expand=function(){this.expanded=!0};TV.TreeNode.prototype.Collapse=function(){this.expanded=!1};TV.TreeNode.prototype.GetRightAnchor=function(){return new TV.Point(this.position.x+this.size.x,this.position.y+this.size.y/2)};TV.TreeNode.prototype.GetLeftAnchor=function(a){return new TV.Point(this.position.x,this.position.y+this.size.y/2)};TV.TreeNode.prototype.EnumerateChildren=function(a){var b,c;for(b=0;b<this.children.length;b++)c=this.children[b],a(c)};
TV.TreeNode.prototype.EnumerateVisibleChildren=function(a){this.expanded&&this.EnumerateChildren(a)};TV.TreeNode.prototype.EnumerateChildrenRecursive=function(a){var b,c;for(b=0;b<this.children.length;b++)c=this.children[b],a(c),c.EnumerateChildrenRecursive(a)};TV.TreeLayout=function(){this.nodeId=0;this.rootNode=null;this.dimensions={defaultNodeWidth:100,defaultNodeHeight:25,nodeHorizontalSpace:50,nodeVerticalSpace:20}};
TV.TreeLayout.prototype.LoadData=function(a){function b(a,c,d){d=new TV.TreeNode(a.nodeId,c.text,d);d.SetPosition(0,0);d.SetSize(100,25);a.nodeId+=1;c=c.children;if(void 0!==c){var f;for(f=0;f<c.length;f++)b(a,c[f],d)}return d}this.rootNode=b(this,a,null);var c=this.dimensions.defaultNodeWidth,d=this.dimensions.defaultNodeHeight;this.EnumerateNodes(function(a){a.SetSize(c,d)})};TV.TreeLayout.prototype.GetRootNode=function(){return this.rootNode};
TV.TreeLayout.prototype.SetNodeSpacing=function(a,b){this.dimensions.nodeHorizontalSpace=a;this.dimensions.nodeVerticalSpace=b};
TV.TreeLayout.prototype.CalculateLayout=function(){function a(a,b,c){function e(a,b,c){if(void 0!==c[a.id])return c[a.id];var d=0,g=0;a.EnumerateVisibleChildren(function(a){d+=e(a,b,c);d+=b.nodeVerticalSpace;g+=1});d=0!==g?d-b.nodeVerticalSpace:a.size.y;return c[a.id]=d}var f=-e(a,b,c.verticalHeightCache)/2+a.size.y/2;a.EnumerateVisibleChildren(function(h){var k=e(h,b,c.verticalHeightCache);h.position.x=a.position.x+a.size.x+b.nodeHorizontalSpace;h.position.y=a.position.y+f+(k-a.size.y)/2;f+=k+b.nodeVerticalSpace})}
if(null!==this.rootNode){var b=this,c={verticalHeightCache:{}};this.EnumerateVisibleNodes(function(d){a(d,b.dimensions,c)})}};TV.TreeLayout.prototype.GetLayoutBox=function(){var a=new TV.Point(0,0),b=new TV.Point(0,0);this.EnumerateVisibleNodes(function(c){a.x=Math.min(c.position.x,a.x);a.y=Math.min(c.position.y,a.y);b.x=Math.max(c.position.x+c.size.x,b.x);b.y=Math.max(c.position.y+c.size.y,b.y)});var c=Math.abs(b.x-a.x),d=Math.abs(b.y-a.y);return{x:a.x,y:a.y,width:c,height:d}};
TV.TreeLayout.prototype.EnumerateNodes=function(a){function b(a,d){d(a);a.EnumerateChildren(function(a){b(a,d)})}null!==this.rootNode&&b(this.rootNode,a)};TV.TreeLayout.prototype.EnumerateVisibleNodes=function(a){function b(a,d){d(a);a.EnumerateVisibleChildren(function(a){b(a,d)})}null!==this.rootNode&&b(this.rootNode,a)};
TV.TreeViewer=function(a){this.drawer=a;this.drawer.RegisterEvents({onMouseDown:this.OnMouseDown.bind(this),onMouseUp:this.OnMouseUp.bind(this),onMouseMove:this.OnMouseMove.bind(this),onMouseWheel:this.OnMouseWheel.bind(this)});this.offset=new TV.Point(0,0);this.scale=1;this.layout=new TV.TreeLayout;this.align=!1;this.move=this.mouse=null;window.addEventListener("resize",this.OnResize.bind(this),!1)};TV.TreeViewer.prototype.LoadData=function(a){this.layout.LoadData(a);this.align=!0};
TV.TreeViewer.prototype.EnumerateNodes=function(a){this.layout.EnumerateNodes(a)};TV.TreeViewer.prototype.SetNodesSize=function(a,b){this.layout.EnumerateNodes(function(c){c.SetSize(a,b)})};TV.TreeViewer.prototype.SetNodesToAutomaticSize=function(){var a=this.drawer;this.layout.EnumerateNodes(function(b){var c=a.GetNodeMinSize(b);b.SetSize(c.x+20,c.y+10)})};
TV.TreeViewer.prototype.SetNodesToMaxSize=function(){var a=0,b=0,c=this.drawer;this.layout.EnumerateNodes(function(d){d=c.GetNodeMinSize(d);a=Math.max(d.x,a);b=Math.max(d.y,b)});this.layout.EnumerateNodes(function(c){c.SetSize(a+20,b+10)})};TV.TreeViewer.prototype.SetNodeSpacing=function(a,b){this.layout.SetNodeSpacing(a,b)};TV.TreeViewer.prototype.Update=function(){this.layout.CalculateLayout();this.align&&(this.AutoAlign(),this.align=!1);this.Draw()};
TV.TreeViewer.prototype.AutoAlign=function(){if(null!==this.layout.GetRootNode()){var a=this.layout.GetLayoutBox(),b=this.drawer.GetDrawingSize();this.offset.x=a.width<b.x?(b.x-a.width)/2:20;this.offset.y=(b.y-a.height)/2-a.y}};TV.TreeViewer.prototype.GetLayout=function(){return this.layout};TV.TreeViewer.prototype.Draw=function(){var a=this.drawer;a.DrawStart();var b=this.offset,c=this.scale;this.layout.EnumerateVisibleNodes(function(d){a.DrawNode(d,b,c)});a.DrawEnd()};
TV.TreeViewer.prototype.SearchNode=function(a,b){var c=TV.ScreenToModel(a,this.offset.x,this.scale),d=TV.ScreenToModel(b,this.offset.y,this.scale),g=null;this.layout.EnumerateVisibleNodes(function(a){null===g&&c>=a.position.x&&c<=a.position.x+a.size.x&&(d>=a.position.y&&d<=a.position.y+a.size.y)&&(g=a)});return g};TV.TreeViewer.prototype.OnMouseDown=function(a,b){this.mouse=new TV.Point(a,b);this.move=!1};
TV.TreeViewer.prototype.OnMouseUp=function(a,b){if(!this.move){var c=this.SearchNode(a,b);null!==c&&(c.IsExpanded()?c.Collapse():c.Expand(),this.Update())}this.move=this.mouse=null};TV.TreeViewer.prototype.OnMouseMove=function(a,b){null!==this.mouse&&(this.offset.x+=a-this.mouse.x,this.offset.y+=b-this.mouse.y,this.mouse.Set(a,b),this.move=!0,this.Draw())};
TV.TreeViewer.prototype.OnMouseWheel=function(a,b,c){var d=this.scale,d=0<c?1.1*d:0.9*d;0.1>d||10<d||(c=this.scale-d,a=TV.ScreenToModel(a,this.offset.x,this.scale),b=TV.ScreenToModel(b,this.offset.y,this.scale),this.offset.x+=a*c,this.offset.y+=b*c,this.scale=d,this.Draw())};TV.TreeViewer.prototype.OnResize=function(){this.Draw()};
TV.DrawStyle=function(a){this.fontSize=12;this.fontFamily="Arial";this.lineWidth=1;this.rectColorWithChildren=this.rectColorNoChildren=this.textColorWithChildren=this.textColorNoChildren="#000000";this.nodeColorNoChildren="#ffffff";this.nodeColorWithChildren="#f5f5f5";this.lineColor="#000000";TV.CopyObjectProperties(a,this)};TV.DrawStyle.prototype.GetFontSize=function(a){return Math.round(this.fontSize*a)};TV.DrawStyle.prototype.GetFontFamily=function(){return this.fontFamily};
TV.DrawStyle.prototype.GetLineWidth=function(a){return Math.round(this.lineWidth*a)};TV.DrawStyle.prototype.GetTextColor=function(a){return a.HasChild()?this.textColorWithChildren:this.textColorNoChildren};TV.DrawStyle.prototype.GetRectColor=function(a){return a.HasChild()?this.rectColorWithChildren:this.rectColorNoChildren};TV.DrawStyle.prototype.GetNodeColor=function(a){return a.HasChild()?this.nodeColorWithChildren:this.nodeColorNoChildren};TV.DrawStyle.prototype.GetLineColor=function(a){return this.lineColor};
TV.SVGDrawer=function(a,b){this.svg=a;this.svgNodes={};this.svg.setAttributeNS(null,"transform","translate(0.5,0.5)");this.style=b;this.events=null};
TV.SVGDrawer.prototype.RegisterEvents=function(a){this.events=a;this.svg.addEventListener("mousedown",this.OnMouseDown.bind(this),!1);document.addEventListener("mouseup",this.OnMouseUp.bind(this),!1);document.addEventListener("mousemove",this.OnMouseMove.bind(this),!1);this.svg.addEventListener("DOMMouseScroll",this.OnMouseWheel.bind(this),!1);this.svg.addEventListener("mousewheel",this.OnMouseWheel.bind(this),!1)};
TV.SVGDrawer.prototype.GetDrawingSize=function(a){a=this.svg.getBoundingClientRect();return new TV.Point(a.width,a.height)};TV.SVGDrawer.prototype.GetNodeMinSize=function(a){var b=this.style.GetFontSize(1),c=this.style.GetFontFamily(),d=document.createElementNS("http://www.w3.org/2000/svg","text");d.setAttributeNS(null,"font-size",b+"px");d.setAttributeNS(null,"font-family",c);this.svg.appendChild(d);d.textContent=a.GetText();a=d.getBBox();b=new TV.Point(a.width,b);this.svg.removeChild(d);return b};
TV.SVGDrawer.prototype.DrawStart=function(){};TV.SVGDrawer.prototype.DrawEnd=function(){};
TV.SVGDrawer.prototype.DrawNode=function(a,b,c){function d(a,b,c){a=TV.ModelToScreen(a,b||0,c||1);return parseInt(a,10)}if(a.IsCollapsed()){var g=this.svg,l=this.svgNodes;a.EnumerateChildrenRecursive(function(a){a=a.GetId();var b=l[a];void 0!==b&&null!==b&&(l[a]=null,g.removeChild(b.rect),g.removeChild(b.text),g.removeChild(b.line))})}var e=a.GetId(),e=this.svgNodes[e];if(void 0===e||null===e)e=this.CreateNode(a);a.HasChild();var f=a.GetPosition(),h=a.GetSize(),k=Math.max(this.style.GetLineWidth(c),
1),p=this.style.GetFontSize(c),q=this.style.GetFontFamily();e.rect.setAttributeNS(null,"x",d(f.x,b.x,c));e.rect.setAttributeNS(null,"y",d(f.y,b.y,c));e.rect.setAttributeNS(null,"width",d(h.x,null,c));e.rect.setAttributeNS(null,"height",d(h.y,null,c));e.rect.setAttributeNS(null,"stroke",this.style.GetRectColor(a));e.rect.setAttributeNS(null,"fill",this.style.GetNodeColor(a));e.rect.setAttributeNS(null,"stroke-width",k);if(a.HasParent()){var m=a.GetParent().GetRightAnchor(),n=a.GetLeftAnchor();e.line.setAttributeNS(null,
"x1",d(m.x,b.x,c));e.line.setAttributeNS(null,"y1",d(m.y,b.y,c));e.line.setAttributeNS(null,"x2",d(n.x,b.x,c));e.line.setAttributeNS(null,"y2",d(n.y,b.y,c));e.line.setAttributeNS(null,"stroke",this.style.GetLineColor());e.line.setAttributeNS(null,"stroke-width",k)}k=f.y+h.y/2;e.text.setAttributeNS(null,"x",d(f.x+h.x/2,b.x,c));e.text.setAttributeNS(null,"y",d(k,b.y,c));e.text.setAttributeNS(null,"fill",this.style.GetTextColor(a));e.text.setAttributeNS(null,"font-size",p+"px");e.text.setAttributeNS(null,
"font-family",q)};
TV.SVGDrawer.prototype.CreateNode=function(a){var b=a.GetId(),c={rect:null,text:null,line:null};c.rect=document.createElementNS("http://www.w3.org/2000/svg","rect");c.rect.setAttributeNS(null,"shape-rendering","crispEdges");this.svg.appendChild(c.rect);a.HasParent()&&(c.line=document.createElementNS("http://www.w3.org/2000/svg","line"),this.svg.appendChild(c.line));c.text=document.createElementNS("http://www.w3.org/2000/svg","text");c.text.setAttributeNS(null,"text-anchor","middle");c.text.setAttributeNS(null,
"dominant-baseline","central");c.text.textContent=a.GetText();this.svg.appendChild(c.text);return this.svgNodes[b]=c};TV.SVGDrawer.prototype.OnMouseDown=function(a){a=a||window.event;a.preventDefault();a=this.CalcMousePosition(a.clientX,a.clientY);this.events.onMouseDown(a.x,a.y)};TV.SVGDrawer.prototype.OnMouseUp=function(a){a=a||window.event;a.preventDefault();a=this.CalcMousePosition(a.clientX,a.clientY);this.events.onMouseUp(a.x,a.y)};
TV.SVGDrawer.prototype.OnMouseMove=function(a){a=a||window.event;a.preventDefault();a=this.CalcMousePosition(a.clientX,a.clientY);this.events.onMouseMove(a.x,a.y)};TV.SVGDrawer.prototype.OnMouseWheel=function(a){var b=a||window.event;b.preventDefault();a=0;b.detail?a=-b.detail:b.wheelDelta&&(a=b.wheelDelta/40);b=this.CalcMousePosition(b.clientX,b.clientY);this.events.onMouseWheel(b.x,b.y,a)};
TV.SVGDrawer.prototype.CalcMousePosition=function(a,b){var c=this.svg.getBoundingClientRect();return new TV.Point(a-c.left,b-c.top)};TV.CanvasDrawer=function(a,b){this.canvas=a;this.context=a.getContext("2d");this.context.translate(0.5,0.5);this.style=b;this.events=null};
TV.CanvasDrawer.prototype.RegisterEvents=function(a){this.events=a;this.canvas.addEventListener("mousedown",this.OnMouseDown.bind(this),!1);document.addEventListener("mouseup",this.OnMouseUp.bind(this),!1);document.addEventListener("mousemove",this.OnMouseMove.bind(this),!1);this.canvas.addEventListener("DOMMouseScroll",this.OnMouseWheel.bind(this),!1);this.canvas.addEventListener("mousewheel",this.OnMouseWheel.bind(this),!1)};
TV.CanvasDrawer.prototype.GetDrawingSize=function(a){return new TV.Point(this.canvas.width,this.canvas.height)};TV.CanvasDrawer.prototype.GetNodeMinSize=function(a){var b=this.style.GetFontSize(1),c=this.style.GetFontFamily();this.context.font=b+"px "+c;a=this.context.measureText(a.GetText());return new TV.Point(a.width,b)};
TV.CanvasDrawer.prototype.DrawStart=function(){this.context.clearRect(0,0,this.canvas.width,this.canvas.height);this.context.fillStyle="#ffffff";this.context.fillRect(0,0,this.canvas.width,this.canvas.height)};TV.CanvasDrawer.prototype.DrawEnd=function(){};
TV.CanvasDrawer.prototype.DrawNode=function(a,b,c){function d(a,b,c){a=TV.ModelToScreen(a,b||0,c||1);return Math.round(a)}var g=a.GetPosition(),l=a.GetSize(),e=d(g.x,b.x,c),f=d(g.y,b.y,c),h=d(l.x,null,c),k=d(l.y,null,c);this.context.beginPath();this.context.fillStyle=this.style.GetNodeColor(a);this.context.fillRect(e,f,h,k);this.context.lineWidth=this.style.GetLineWidth(c);this.context.strokeStyle=this.style.GetRectColor(a);this.context.rect(e,f,h,k);this.context.stroke();a.HasParent()&&(this.context.beginPath(),
e=a.GetParent().GetRightAnchor(),f=a.GetLeftAnchor(),this.context.strokeStyle=this.style.GetLineColor(a),this.context.moveTo(d(e.x,b.x,c),d(e.y,b.y,c)),this.context.lineTo(d(f.x,b.x,c),d(f.y,b.y,c)),this.context.stroke());e=a.GetText();f=this.style.GetFontSize(c);h=this.style.GetFontFamily();this.context.font=f+"px "+h;this.context.fillStyle=this.style.GetTextColor(a);this.context.textAlign="center";this.context.textBaseline="middle";a=g.y+l.y/2+1;this.context.fillText(e,d(g.x+l.x/2,b.x,c),d(a,b.y,
c))};TV.CanvasDrawer.prototype.OnMouseDown=function(a){a=a||window.event;a.preventDefault();a=this.CalcMousePosition(a.clientX,a.clientY);this.events.onMouseDown(a.x,a.y)};TV.CanvasDrawer.prototype.OnMouseUp=function(a){a=a||window.event;a.preventDefault();a=this.CalcMousePosition(a.clientX,a.clientY);this.events.onMouseUp(a.x,a.y)};TV.CanvasDrawer.prototype.OnMouseMove=function(a){a=a||window.event;a.preventDefault();a=this.CalcMousePosition(a.clientX,a.clientY);this.events.onMouseMove(a.x,a.y)};
TV.CanvasDrawer.prototype.OnMouseWheel=function(a){var b=a||window.event;b.preventDefault();a=0;b.detail?a=-b.detail:b.wheelDelta&&(a=b.wheelDelta/40);b=this.CalcMousePosition(b.clientX,b.clientY);this.events.onMouseWheel(b.x,b.y,a)};TV.CanvasDrawer.prototype.CalcMousePosition=function(a,b){return new TV.Point(a-(this.canvas.offsetLeft-window.pageXOffset),b-(this.canvas.offsetTop-window.pageYOffset))};TV.CreateCanvasViewer=function(a,b){var c=new TV.DrawStyle(b),c=new TV.CanvasDrawer(a,c);return new TV.TreeViewer(c)};
TV.CreateSVGViewer=function(a,b){var c=new TV.DrawStyle(b),c=new TV.SVGDrawer(a,c);return new TV.TreeViewer(c)};