// p5's functions start //
function setup() {
    createCanvas(windowWidth, windowHeight);
	stroke(150);
	frameRate(.03); // set a low framerate so we don't DOS our API
	redraw();
}

function draw() {
	vis.get_archives(500);
	vis.hide_box();
}

function mouseMoved() {
	vis.show_box();
}

function mouseClicked() {

	// check to see if the mouse click is near a line, if so,
	// open the archive associated with it in a new window
	var closest_archive = vis.is_point_in_line(mouseX, mouseY);
	if (closest_archive) {
		window.open(vis.config.perma_archives_base_url + closest_archive,'_blank');
	}

}
// p5's functions end //


// keep all of our vis config and logic here
var vis = {};

// store global variables here
vis.config = {
	 	perma_archives_api_url: 'https://api.perma.cc/v1/public/archives/',
	 	perma_archives_base_url: 'https://perma.cc/',
	 	perma_archives: {},
	 	box_displayed_at: Date.now()
	 }

// we hit the Perma API for recent archives and add them to a
// list if we haven't seen them before.
vis.get_archives = function(limit) {
	$.ajax({
	    url: vis.config.perma_archives_api_url,
	    data: {limit: limit},
	    jsonp: "callback",
	    dataType: "jsonp",

	    success: function(response) {
	    	var now = moment().date();
	        $.each(response.objects, function(index, value) {
				var created_today = now === moment(value.creation_timestamp).date();
	        	if (!(value.guid in vis.config.perma_archives) && created_today) {
					vis.config.perma_archives[value.guid] = {};
				}
			});

			vis.draw_lines();
	    }
	});
}

// draw lines on the canvas for new archives
vis.draw_lines = function() {

	$.each(vis.config.perma_archives, function(key, value) {

		if (!('point_1' in value)) {
			// Start with a random x and y
			var point_1 = {'x': vis.get_random_int(0, windowWidth), 'y': vis.get_random_int(0, windowHeight)};
			// Get and second x and y that's not too far away
			var point_2 = vis.get_close_point(point_1);

			vis.config.perma_archives[key] = {'point_1': point_1, 'point_2': point_2}

			line(point_1.x, point_1.y, point_2.x, point_2.y);

			var archive_count = Object.keys(vis.config.perma_archives).length;
			var archive_count_message = (archive_count == 1 ? 'archive today' : 'archives today');
			$('#counter-panel p.count').html(archive_count);
			$('#counter-panel .count-description p').html(archive_count_message);
		}
	});
}

// return a point that's close to the point that's passed in
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

// If we find that the x, y is close to a point in our line,
// return the guid assoicated with the line
//
// We find our slope, and then loop
// through the points on that slope. Somethign like, 
// slope = (y1 - y2) / (x1-x2);
// c = y1 - x1 * slope; 
// Then, for all x values between our two x values, we gour our y,
// y = mx + c;
vis.is_point_in_line = function(mouse_x, mouse_y) {

	var slope, c, x_range, y_value, distance, closest_guid;

	$.each(vis.config.perma_archives, function(key, value) {
		slope = (value.point_1.y - value.point_2.y) / (value.point_1.x - value.point_2.x);
		c = value.point_1.y - value.point_1.x * slope;

		if (value.point_1.x <= value.point_2.x) {
			x_range = vis.range(value.point_1.x, value.point_2.x);
		} else {
			x_range = vis.range(value.point_2.x, value.point_1.x);
		}

		$.each(x_range, function(x_key, x_value) {
			y_value = Math.floor(slope * x_value + c);

			distance = Math.sqrt( (x_value-mouse_x) * (x_value-mouse_x) + 
					(mouse_y-y_value) * (mouse_y-y_value) );

			if (distance < 4) {
				closest_guid = key;
				return false;
			}
		});
	});

	return closest_guid;
}

// hides our info box after the mouse isn't moved for a little while
vis.hide_box = function() {
	if (Date.now() - vis.config.box_displayed_at > 3000) {
		$('#counter-panel').hide(300);
		$('body').css('cursor', 'none');
	}
}

// shows our info box
vis.show_box = function() {
	if (Object.keys(vis.config.perma_archives).length > 0) {
		$('body').css('cursor', 'default');
		$('#counter-panel').show(100);
		vis.config.box_displayed_at = Date.now();
	}
}


// a simple helper that returns a random integer
vis.get_random_int  = function(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}


// a helper function to get a list of all values between start and end
vis.range = function(start, end) {
    var array = new Array();
    for(var i = start; i < end; i++)
    {
        array.push(i);
    }
    return array;
}
