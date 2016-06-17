/*
 * MESSAGE DIAGRAM GENERATOR
*/

// globals
var h;
var c;
var arrow;
var marker;
var y0 = 60; // First y offset
var evCount = 0; // event counter
var evHeight = 35; // event height
var evAngle = 6; // aprox. angle of events
var numEvents = dataContent.length;
var heightContent = numEvents * evHeight;
var maxY = 0;
var browserWidth;

// Updates maxY variable
function setMaxY(newY) {
	if (newY > maxY) {
		maxY = newY;
	}
}

// Draws a generic title in this event position
function drawTitle(conf) {
	var y = evCount * evHeight + y0;
	c.rect(0, y + 3, 600, evHeight).attr({ class: "evTitleWrapper" });
	c.text(20, y + 20, conf.label).addClass("evTitle");

	setMaxY(y);
	evCount++;
}

// Draws an information icon with a tooltip with its own event row
function drawInfo(conf, a) {
	var y = evCount * evHeight + y0;
	var x = a.node.x1.baseVal.value;
	var infoIco = c.image("img/ico-info.png", x - 10, y, 32, 32);
	// set up tooltip
	if (conf.label != "") {
		infoIco.hover(function() {
			$("#tooltip").html(conf.label).css("top", y + "px").css("left", (x + 32) + "px").show();
		}, function() {
			$("#tooltip").hide();
		})
	}

	setMaxY(y);
	evCount++;
}

// Draws a table with key:value pairs in a node
function drawTable(text, a) {
	// Parse table data
	var pairs = text.split(",");
	var numPairs = pairs.length;

	var header = "<tr>";
	var body = "<tr>";
	var pair, pairData, i = 0;
	for (i = 0 ; i < numPairs ; i++) {
		pair = pairs[i];
		pairData = pair.split(":");
		header += "<th>" + pairData[0] + "</th>";
		body += "<td>" + pairData[1] + "</td>";
	}
	header += "</tr>";
	body += "</tr>";

	var y = evCount * evHeight + y0;
	var x = a.node.x1.baseVal.value;

	var $table = $("<table style='top: " + y + "px; left: " + x + "px;'>" + header + body + "</table>");
	$("#htmlContent").append($table);
	$table.css("margin-left", -($table.width() / 2))

	setMaxY(y);
	evCount++;
}

// Draws an axis with a label
function drawAxis(label, x, color) {
	var y = evCount * evHeight + y0;
	var axis = c.line(x, 20, x, "100%").attr({ "stroke": color, class: "axis" });
	h.circle(x, 30, 20).attr({ class:"axisCircle", stroke: color });
	h.text(x, 36, label).attr({ "font-size": "22px", "text-anchor": "middle", fill: color });

	setMaxY(y);
	return axis;
}
// Draws an arrow with a label from one axis to another (1 to 2)
function drawMsg(label, a1, a2) {
	var y1 = evCount * evHeight + y0;
	var y2 = y1 + evHeight;
	var x1 = a1.node.x1.baseVal.value;
	var x2 = a2.node.x1.baseVal.value;
	var leftToRight = (x2 > x1);
	var tx = (leftToRight) ? (x1 + (x2 - x1) / 2) : (x2 + (x1 - x2) / 2);
	var ty = y1 + (evHeight / 2) - 5;
	var angle = (leftToRight) ? "r" + evAngle : "r" + (360 - evAngle);
	c.line(x1, y1 + 4, x2, y2).attr({ "stroke": "#000", markerEnd: marker });
	c.text(tx, ty, label).attr({ "font-size": "14px", "text-anchor": "middle", fill: "#000" }).transform(angle);
	
	setMaxY(y2);
	evCount++;
}

// Draws an event in the axis
//{ type: "tmpState", axis: vs, label: "Prepare: P=C1, wait ACK" },
function drawAxisEvent(conf, axis) {
	var x = axis.node.x1.baseVal.value;
	var y = evCount * evHeight + y0;
	
	var circ = c.circle(x, y, 20);
	switch (conf.color) {
		case "yellow":
			circ.addClass("tmpState");
			break;
		case "green":
			circ.addClass("fixedState");
			break;
		case "red":
			circ.addClass("errorState");
			break;
	}
	// set up tooltip
	if (conf.label != "") {
		circ.hover(function() {
			$("#tooltip").html(conf.label).css("top", (y + 30) + "px").css("left", x + "px").show();
		}, function() {
			$("#tooltip").hide();
		})
	}

	setMaxY(y);
}

$(document).ready(function() {

	$("#content").height(heightContent);

	// Limit console column on small screens
	browserWidth = $(document).width();
	if (browserWidth <= 1024) {
		$("#console").css("max-width", "470px");
	}
	
	// prepare Snap vars
	h = Snap("#header");
	c = Snap("#content");
	arrow = c.polygon([0, 10, 10, 10, 5, 0, 0, 10]).attr({ fill: '#323232' }).transform('r90');
	marker = arrow.marker(0, 0, 10, 10, 10, 5);
	
	// Create associative array of axis SVG objects
	var axis = [];
	var i = 0, n = dataAxis.length;
	var posX = 50;
	for (i = 0 ; i < n ; i++) {
		axis[dataAxis[i].id] = drawAxis(dataAxis[i].label, posX, dataAxis[i].color);
		posX += 150;
	}

	// Draw events content
	var i = 0;
	for (i = 0 ; i < numEvents ; i++) {
		var type = dataContent[i].type;
		switch(type) {
			case "msg":
				drawMsg(dataContent[i].label, axis[dataContent[i].from], axis[dataContent[i].to]);
				break;
			case "state":
				drawAxisEvent(dataContent[i], axis[dataContent[i].node]);
				break;
			case "title":
				drawTitle(dataContent[i]);
				break;
			case "info":
				drawInfo(dataContent[i], axis[dataContent[i].node]);
				break;
			case "table":
				drawTable(dataContent[i].text, axis[dataContent[i].node]);
				break;
			case "next":
				evCount++;
				break;
		}
		
	}
	// set svg area height to match content
	$("#content").height(maxY + evHeight);

});