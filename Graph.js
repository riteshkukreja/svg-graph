var Graph = function(data, options) {

	/**
	 *
	 *	Sample methods to be used
	 *
	 */
	var random = function(min, max) {
	 	return (Math.random() * (max-min+1) + min).toFixed(2);
	 }

	var randomInt = function(min, max) {
	 	return parseInt(Math.random() * (max-min+1)) + min;
	 }

	var randomData = function(count) {
	 	var sampleData = {};
	 	for(var i = 0; i < count; i++) {
	 		sampleData[i] = random(0, 100000);
	 	}

	 	return sampleData;
	 }

	var randomColor = function(alpha) {
	 	var r = randomInt(0, 255),
	 	g = randomInt(0, 255),
	 	b = randomInt(0, 255);

	 	if(typeof alpha == "undefined")
	 		return "rgb(" + r + ", " + g + ", " + b + ")";
	 	else
	 		return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
	 }

	var addAlpha = function(rgb, alpha) {
	 	rgb = rgb.replace(")", "");
	 	rgb = rgb.replace("rgb", "rgba");
	 	rgb += ", " + alpha + ")";

	 	return rgb;
	 }

	/**
	 *
	 *	Global Variables
	 *
	 */

	var data 		= data,
	 	xOffset 	= 50,
	 	gap 		= 0,
	 	maxHeight 	= 500,
	 	maxWidth 	= 600,
	 	sampleSpace = 10,

	 	setMaxHeight = 0,
	 	namespaceURI;

	var assign = function(options) {
	 	// assign data
	 	if(typeof  data == "undefined")
	 		 data = randomData(sampleSpace);

	 	if(typeof options == "undefined") return;

	 	// assign options
	 	if(typeof options.width == "number")
	 		 xOffset = options.width;

	 	if(typeof options.gap == "number")
	 		 gap = options.gap;

	 	if(typeof options.maxHeight == "number")
	 		 maxHeight = options.maxHeight;

	 	if(typeof options.maxWidth == "number")
	 		 maxWidth = options.maxWidth;
	}

	var rect = function(key, x, y, height, width, color, holder) {
	 	var rectElement = document.createElementNS( namespaceURI, "rect");

	 	holder.appendChild(rectElement);

	 	rectElement.setAttribute("x", x);
	 	rectElement.setAttribute("y", maxHeight+100);
	 	rectElement.setAttribute("data-key", key);
	 	rectElement.setAttribute("height", "0");
	 	rectElement.setAttribute("width", width);

	 	rectElement.style.fill = color;
	 	rectElement.style.transition = "all 500ms linear, fill 200ms linear";

	 	setTimeout(function() {
	 		rectElement.setAttribute("y", y + 100);
	 		rectElement.setAttribute("height", height);
	 	}, 10);


	 	var textNode = document.createElementNS( namespaceURI, "text");
	 	textNode.setAttribute("x", x + 5);
	 	textNode.setAttribute("y", y + 90);
	 	textNode.innerHTML = rectElement.getAttribute("data-key");
	 	textNode.style = "fill:" + addAlpha(color, .8) + "; font-size: 14px; font-weight: bold";

	 	rectElement.addEventListener("mouseenter", function() {
	 		rectElement.style = "fill:" + addAlpha(color, 0.8);
	 		holder.appendChild(textNode);
	 	});

	 	rectElement.addEventListener("mouseout", function() {
	 		rectElement.style = "fill:" + color;
	 		holder.removeChild(textNode);
	 	});
	} 

	var adjustDimensions = function(data) {
	 	sampleSpace = Object.keys(data).length;

		// calculate width of each node
		var Width = ( xOffset +  gap) * sampleSpace;

		 xOffset = ( maxWidth / Width) *  xOffset;
		 gap = ( maxWidth / Width) *  gap;

		// get maximum value node
		for(key in Object.keys(data)) {
			if(parseFloat(data[key]) >  setMaxHeight)
				 setMaxHeight = parseInt(data[key]) + 1;
		}
	}

	var build = function(data, x0, y0, holder) {

		var x = x0, y = y0;

		adjustDimensions(data);

		for(key of Object.keys(data)) {
			var percent = ((parseFloat(data[key]) /  setMaxHeight) * 100).toFixed(1);
			var height = (parseFloat(data[key]) /  setMaxHeight) *  maxHeight;

			rect(percent+"%", x, y-height, height,  xOffset, randomColor(), holder);
			x +=  xOffset +  gap;
		}
	}

	var init = function(options) {
		var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		var g = document.createElementNS(svg.namespaceURI, "g");

		namespaceURI = svg.namespaceURI;

		assign(options);

		build( data, 2,  maxHeight-2, g);

		return g;
	}

	return init(options);

}