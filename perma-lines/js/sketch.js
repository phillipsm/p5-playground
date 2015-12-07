// p5's initialization function
function setup() {
    createCanvas(windowWidth, windowHeight);
	stroke(150);
	frameRate(.1); // Set a super low framerate so we don't DOS our API
	redraw();
}

// p5's function that loops fo-eva
function draw() {
	vis.draw_lines();
	vis.hide_box();
}

function mouseMoved() {
	$('body').css('cursor', 'default');
	$('#counter-panel').show(100);
	vis.config.box_displayed_at = Date.now();
}

// Keep all of our vis confgi and logic here
var vis = {};

// Store global variables here
vis.config = {
	 	perma_archives_api_url: 'https://api.perma.cc/v1/public/archives/',
	 	perma_archives: [],
	 	box_displayed_at: Date.now()
	 }

// This is where the heavy lifting happens. We hit the Perma API for
// recent archives and add them to a list if we haven't seen them
// before. When we add them to our list, we also draw a random
// line for each one
vis.draw_lines = function() {
	$.ajax({
	    url: vis.config.perma_archives_api_url,
	    jsonp: "callback",
	    dataType: "jsonp",

	    success: function(response) {
	        $.each(response.objects, function(index, value) {
				if (vis.config.perma_archives.indexOf(value.guid) === -1) {
					vis.config.perma_archives.push(value.guid)


					// Only draw a line wen we have more than 20 archives (since
					// our first request to the Perma API will always return the
					// 20 most recent.)
					if (vis.config.perma_archives.length > 20) {
						// Start with a random x and y
						var point_1 = {'x': vis.get_random_int(0, windowWidth), 'y': vis.get_random_int(0, windowHeight)};
						// Get and second x and y that's not too far away
						var point_2 = vis.get_close_point(point_1);

						line(point_1.x, point_1.y, point_2.x, point_2.y);
					}
					
					$('#counter-panel p.count').html(vis.config.perma_archives.length - 20);
				}
			});
	    }
	});
}

// Return a point that's close to the point that's passed in
vis.get_close_point = function(starting_point) {
	var nearby_point = {'x': 0, 'y': 0};
	var distance = Math.sqrt( (nearby_point.x-starting_point.x) * (nearby_point.x-starting_point.x) + 
					(nearby_point.y-starting_point.y) * (nearby_point.y-starting_point.y) );
	
	while (distance < 25 || distance > 50) {
		nearby_point.x = vis.get_random_int(starting_point.x - 25, starting_point.x + 25);
		nearby_point.y = vis.get_random_int(starting_point.y - 25, starting_point.y + 25);
		distance = Math.sqrt( (nearby_point.x-starting_point.x) * (nearby_point.x-starting_point.x) + 
					(nearby_point.y-starting_point.y) * (nearby_point.y-starting_point.y) );
	}

	return nearby_point;
}

// A simple helper that returns a random integer
vis.get_random_int  = function(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

// Hides our info box after the mouse isn't moved for a little while
vis.hide_box = function() {
	if (Date.now() - vis.config.box_displayed_at > 3000) {
		$('#counter-panel').hide(300);
		$('body').css('cursor', 'none');
	}
}