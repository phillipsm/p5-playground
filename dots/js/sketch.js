var c, _2;

function setup() {
	createCanvas(windowWidth, windowHeight);

	c = color(71, 255, 157, 110);
	c_2 = color(255, 72, 48, 110);

	noStroke();
	noLoop();
}

function draw() {

	var num_dots = get_rand_int(75, 95);

	for(var i=0; i < num_dots; i++) {
		
		if( i%3 === 0 ) {
			fill(c_2);
		} else {
			fill(c);
		}

		ellipse(get_rand_int(0, windowWidth), get_rand_int(0, windowHeight), 30, 30);
	}
}


function get_rand_int(min, max) {
	// A helper function that returns an integer between
	// min and max

	return Math.floor(Math.random() * (max - min) + min);
}