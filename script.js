'use strict';

const svg = document.getElementById('fantasyMap');


const svgBox = svg.getBBox();

let x = svgBox.x, y = svgBox.y;
let zoom = 0;
let isMoving = false;
let startingX, startingY;

svg.addEventListener('mousedown', e => {
	startingX = e.offsetX;
	startingY = e.offsetY;
	isMoving = true;
});

svg.addEventListener('mousemove', e => {
	if(isMoving == true){
		movingMap(e);
	}
});

svg.addEventListener('mouseup', e => {
	isMoving = false;
});

svg.addEventListener('wheel', e => {
	if (e.deltaY < 0) {
		zoom = clamp(zoom + 1, 0, 10);
		movingMap();
	} else if (e.deltaY > 0) {
		zoom = clamp(zoom - 1, 0, 10);
		movingMap();
	}
})

function movingMap(event){
	let width, height;

	// Zoom of 0 is show the whole thing
	if (zoom == 0) {
		x = svgBox.x;
		y = svgBox.y;
		width  = svgBox.width;
		height = svgBox.height;
	} else {
		// Define how big an area we view on the current zoom.
		width  = svgBox.width / Math.pow(2, zoom);
		height = svgBox.height / Math.pow(2, zoom);

		if (event) {
			// Add the new section of drift
			x += (event.clientX - startingX) / Math.pow(2, 3 + zoom);
			y += (event.clientY - startingY) / Math.pow(2, 3 + zoom);
		}

		// Clamp the values to not overflow the box.
		x = clamp(x, svgBox.x, svgBox.width  - width );
		y = clamp(y, svgBox.y, svgBox.height - height);
	}

	// Write the attribute
	svg.setAttribute('viewBox', [x, y, width, height].join(" "));
}

function clamp(num, min, max) {
	return num <= min ? min : num >= max ? max : num;
}

if ('location' in window) {
	const hash = window.location.hash.substring(1).split('!');
	if (hash.length === 3) {
		[zoom, x, y] = hash.map(x => parseInt(x) || 0);
	}
	window.setInterval(() => window.location.hash = [zoom,x,y].map(Math.round).join('!'), 200);
}

movingMap();
