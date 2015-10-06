var rectangles = [];
var shimmering_rects = [];

var color_a = '#4FB477';
var color_b = '#FFC4EB';
var color_shimmer = '#6890E7';
var color_shimmer_transition = '#b1c6f3';
var color_background = '#f3f5fb';


function setup() {
	createCanvas(windowWidth, windowHeight);
	background('#f3f5fb');
	draw_grid();
	window.setInterval(function() {
		shimmer(get_rand_int(0, rectangles.length));},
		get_rand_int(2000, 4000)
	);

	window.setInterval(remove_shimmer, get_rand_int(2000, 4000));

	noLoop();
}

function draw() {
}

function shimmer(random_index) {
	// go out for 300 to 900, come back for 500 to 700 (slightly lighter?), go away for 200 to 500, come back on

	if (shimmering_rects.indexOf(random_index) === -1) {

		shimmering_rects.push(random_index);

		fill(color_shimmer_transition);
		stroke(color_shimmer_transition);
		rect(rectangles[random_index].next_x, rectangles[random_index].next_y, rectangles[random_index].w, rectangles[random_index].h);

		window.setTimeout(function() {
			fill(color_shimmer);
			stroke(color_shimmer);
			rect(rectangles[random_index].next_x, rectangles[random_index].next_y, rectangles[random_index].w, rectangles[random_index].h);
		}, 50);

		window.setTimeout(function() {
			fill(color_shimmer_transition);
			stroke(color_shimmer_transition);
			rect(rectangles[random_index].next_x, rectangles[random_index].next_y, rectangles[random_index].w, rectangles[random_index].h);
		}, 260);

		window.setTimeout(function() {
			fill(color_shimmer);
			stroke(color_shimmer);
			rect(rectangles[random_index].next_x, rectangles[random_index].next_y, rectangles[random_index].w, rectangles[random_index].h);
		}, 360);

		window.setTimeout(function() {
			fill(color_shimmer_transition);
			stroke(color_shimmer_transition);
			rect(rectangles[random_index].next_x, rectangles[random_index].next_y, rectangles[random_index].w, rectangles[random_index].h);
		}, 400);

		window.setTimeout(function() {
			fill(color_shimmer);
			stroke(color_shimmer);
			rect(rectangles[random_index].next_x, rectangles[random_index].next_y, rectangles[random_index].w, rectangles[random_index].h);
		}, 500);

	}
}

function remove_shimmer() {
	// Once we get to 25% shimmering, let's remove some

	if (shimmering_rects.length > .25 * rectangles.length) {
		console.log('removing shimmer');
		var random_shimmering_rect_index = get_rand_int(0, rectangles.length);

		fill(rectangles[random_shimmering_rect_index].fill_color);
		stroke(rectangles[random_shimmering_rect_index].fill_color);

		rect(rectangles[random_shimmering_rect_index].next_x, rectangles[random_shimmering_rect_index].next_y,
			rectangles[random_shimmering_rect_index].w, rectangles[random_shimmering_rect_index].h);

		delete shimmering_rects[random_shimmering_rect_index];
	}
}

function draw_grid() {
	// Draw our sliced bars and calculate the padding on the right and left

	var padding = 30;
	var next_x = padding;
	var next_y = get_rand_int(30, 70);
	var next_height = get_rand_int(30, 70);

	var current_color = color_a;
	
	// Build our list of rectangles and store them
	while (next_x + padding < windowWidth) {
		while (next_y + next_height < windowHeight - get_rand_int(0, 30)) {

			if (current_color === color_a) {
				current_color = color_b;
			} else {
				current_color = color_a;
			}

			rectangles.push({'next_x': next_x, 'next_y': next_y, 'w': 20, 'h': next_height, 'fill_color': current_color});
			next_y += next_height;
			next_height = get_rand_int(30, 70);
		}

		next_x += padding;
		next_y = get_rand_int(30, 70);
	}


	// Draw all of our rectangles
	for (var i=0, len=rectangles.length; i < len; i++) {
		fill(rectangles[i].fill_color);
		stroke(rectangles[i].fill_color)
		rect(rectangles[i].next_x, rectangles[i].next_y, rectangles[i].w, rectangles[i].h);
	}

}


function get_rand_int(min, max) {
	// A helper function that returns an integer between
	// min and max

	return Math.floor(Math.random() * (max - min) + min);
}