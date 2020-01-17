var brick = {}
var grass = {}
var bricks
var hit

var tiles = {
	"brick": brick,
	"grass": grass,
}

//BITMAPS
var gridmap
var bitmap


//Viewport
var view_x = 0
var view_y = 0
var view_scale = 1


var datamap = []
var datamap_width = 640
var datamap_height = 480


//Selected tool
var selected;

var grid_visible = true;
var grid_size = 24;
var grid_width
var grid_height

var bricksObjects = []
var redraw


window.addEventListener('load', function() {
	setup()
})

function draw()
{
	// if (redraw) {
	// 	clear_to_color(bricks,makecol(255,255,255));
	// 	for (const object of bricksObjects) {
	// 		draw_sprite(bricks, brick, object.x, object.y)
	// 	}
	// 	redraw = false
	// }
	// simple_blit(bricks, canvas, 0, 0)
	// simple_blit(bitmap, canvas, 0, 0)
	var w = (datamap_width) * view_scale
	var h = (datamap_height) * view_scale
	stretch_blit(bitmap, canvas, 0, 0, datamap_width, datamap_height,
		view_x, view_y, w, h)
	if (grid_visible) {
		stretch_blit(gridmap, canvas, 0, 0, datamap_width, datamap_height,
			view_x, view_y, w, h)
	}
}

let walker = {
	position: {x:0,y:0},
	direction: 'R'
}
let steps = 14000
let interval = 1

let tick = 0

function update()
{
	tick += 1


	//Movimiento
	if (key[KEY_UP]) {
		view_y += 10;
	} else if (key[KEY_DOWN]) {
		view_y -= 10;
	}

	if (key[KEY_LEFT]) {
		view_x += 10;
	} else if (key[KEY_RIGHT]) {
		view_x -= 10;
	}

	if (key[KEY_PLUS_PAD]) {
		view_scale += 0.05;
		if (view_scale > 3) {
			view_scale = 3
		}
	} else if (key[KEY_MINUS_PAD]) {
		view_scale -= 0.05;
		if (view_scale < 0.1) {
			view_scale = 0.1
		}
	} else if (key[KEY_0_PAD]) {
		view_scale = 1;
		view_x = 0;
		view_y = 0;
	} 


	// if (tick % interval == 0 && steps > 0) {
	// 	walker = walker_step(walker.position, 1, walker.direction)
	// 	steps -= 1
	// 	log("steps left: " + steps)
	// }

	if (mouse_pressed) {
		let x = mouse_x - view_x //respectivo al 0,0
		let grid_x = Math.floor(x/(grid_size*view_scale))
		let bitmap_x = grid_x*grid_size + grid_size/2
		let y = mouse_y - view_y 
		let grid_y = Math.floor(y/(grid_size*view_scale))
		let bitmap_y = grid_y*grid_size + grid_size/2
		
		// draw_sprite(bitmap, brick, bitmap_x, bitmap_y)
		if (tiles[selected]) {
			scaled_sprite(bitmap, tiles[selected], bitmap_x, bitmap_y, 24/32, 24/32)
		}

		// //Math.floor((mouse_x)/grid_size)*grid_size + grid_size/2
		// let pixel = getpixel(bricks, x, y)

		// console.log(`pixel ${pixel}: a:${geta(pixel)} r:${getr(pixel)} g:${getg(pixel)} b:${getb(pixel)}` )
		// if (getpixel(bricks, x, y) != 0 && getpixel(bricks, x, y) != -1) {
		// 	console.log("colision!")
		// 	play_sample(hit)
		// 	// rectfill(bricks, Math.floor((mouse_x)/32)*32, Math.floor((mouse_y)/32)*32, 32, 32, makecolf(1.0,1.0,1.0,1.0))
		// 	redraw = true
		// 	console.log("brick:", getBrick(x,y), "bricks:", bricksObjects)
		// 	bricksObjects = removeBlock(x,y)
		// } else {
		// 	draw_brick(x,y)
		// }
	}
}

function setup() {
	// let button = document.createElement('button')
	// document.body.appendChild(button)
	// button.innerHTML = "START"
	// button.setAttribute('data-toggle-fullscreen','')
	// button.addEventListener('click', fullscreenRequestHandler)
	// button.addEventListener('click', main)
	main()
}

function fill_handler(evt) {
	if (selected) {
		fill(bitmap, tiles[selected])
	}
}

function toggle_grid_handler(evt) {
	grid_visible = !grid_visible
}

function fill(bitmap, sprite) {
	for (var i = 0; i < datamap_width/grid_size; i++) {
		for (var j = 0; j < datamap_height/grid_size; j++) {
			scaled_sprite(bitmap, sprite, i*grid_size + grid_size/2, j*grid_size + grid_size/2, grid_size/32, grid_size/32)
		}
	}
}

function draw_grid() {
	if (gridmap) {
		clear_bitmap(gridmap)
		for (var i = 0; i < datamap_width/grid_size; i++) {
			for (var j = 0; j < datamap_height/grid_size; j++) {
				scaled_sprite(gridmap, grid_slice, i*grid_size + grid_size/2, j*grid_size + grid_size/2, grid_size/32, grid_size/32)
			}
		}
	}
}

function init_bitmaps() {
	// draw_sprite(bitmap, mapa, 0, 0)
	// scaled_sprite(bitmap, mapa, datamap_width/2, datamap_height/2, datamap_width/259, datamap_height/194)
	clear_to_color(bitmap, makecol(255,255,255))
	draw_grid()
}

function select_tile(evt) {
	console.log(evt)
	if (evt.target.className == 'tile') {
		element = evt.target.cloneNode()
		selected = element.name
		element.style.margin = 0;
		element.className = '' //Borrar solo clase tile
		document.getElementById('selected').innerHTML = element.outerHTML
	}
}


function readSingleFile(e) {
	var file = e.target.files[0];
	var reader = new FileReader();
		if (!file) {
			return;
		}
	reader.addEventListener("load", function () {
		var img = new Image();
		img.src = reader.result;
		var now = time();
		var cv = document.createElement('canvas');
		var ctx = cv.getContext("2d");
		var bmp = {canvas:cv,context:ctx,w:-1,h:-1,ready:false,type:"bmp"};
		_downloadables.push(bmp);
		img.onload = function(){
			bmp.canvas.width = img.width;
			bmp.canvas.height = img.height;
			bmp.context.drawImage(img,0,0);
			bmp.w = img.width;
			bmp.h = img.height;
			bmp.ready=true;
			bitmap=bmp
		};
	}, false);
	// reader.onload = function(e) {
	// 	// var contents = e.target.result;
	// 	// uri = URL.createObjectURL(new Blob(contents, {type: "image/any"}))
	// 	console.log(reader.result)
	// 	image = load_bitmap(reader.result)

	// 	// while (!image.ready) {
	// 	// 	console.log(image.ready)
	// 	// }
		
	// 	// alert(contents);
	// };
	reader.readAsDataURL(file);
}
  

function save_handler() {
	title = document.getElementById('title').value
	download(title)
}

var all_keys = [KEY_A, KEY_B, KEY_C, KEY_D, KEY_E, KEY_F, KEY_G, KEY_H, KEY_I, KEY_J, KEY_K, KEY_L, KEY_M, KEY_N, KEY_O, KEY_P, KEY_Q, KEY_R, KEY_S, KEY_T, KEY_U, KEY_V, KEY_W, KEY_X, KEY_Y, KEY_Z, KEY_0, KEY_1, KEY_2, KEY_3, KEY_4, KEY_5, KEY_6, KEY_7, KEY_8, KEY_9, KEY_0_PAD, KEY_1_PAD, KEY_2_PAD, KEY_3_PAD, KEY_4_PAD, KEY_5_PAD, KEY_6_PAD, KEY_7_PAD, KEY_8_PAD, KEY_9_PAD, KEY_F1, KEY_F2, KEY_F3, KEY_F4, KEY_F5, KEY_F6, KEY_F7, KEY_F8, KEY_F9, KEY_F10, KEY_F11, KEY_F12, KEY_ESC, KEY_TILDE, KEY_MINUS, KEY_EQUALS, KEY_BACKSPACE, KEY_TAB, KEY_OPENBRACE, KEY_CLOSEBRACE, KEY_ENTER, KEY_COLON, KEY_QUOTE, KEY_BACKSLASH, KEY_COMMA, KEY_STOP, KEY_SLASH, KEY_SPACE, KEY_INSERT, KEY_DEL, KEY_HOME, KEY_END, KEY_PGUP, KEY_PGDN, KEY_LEFT, KEY_RIGHT, KEY_UP, KEY_DOWN, KEY_SLASH_PAD, KEY_ASTERISK, KEY_MINUS_PAD, KEY_PLUS_PAD, KEY_ENTER_PAD, KEY_PRTSCR, KEY_PAUSE, KEY_EQUALS_PAD, KEY_LSHIFT, KEY_RSHIFT, KEY_LCONTROL, KEY_RCONTROL, KEY_ALT, KEY_ALTGR, KEY_LWIN, KEY_RWIN, KEY_MENU, KEY_SCRLOCK, KEY_NUMLOCK, KEY_CAPSLOCK]


function main()
{

	//Handlers
	document.getElementById('toolbox').addEventListener('click', select_tile)
	document.getElementById('fill_button').addEventListener('click', fill_handler)
	document.getElementById('toggle_grid_button').addEventListener('click', toggle_grid_handler)
	document.getElementById('file-input').addEventListener('change', readSingleFile, false);
	document.getElementById('save_button').addEventListener('click', save_handler)
	// document.getElementById('#fill_button').addEventListener('click', fill_handler)

	// enable_debug('debug');
	allegro_init_all("game_canvas", 640, 480, null, all_keys);
	grid_width = SCREEN_W/grid_size
	grid_height = SCREEN_H/grid_size

	tiles.brick = load_bmp('brick32.png')
	tiles.grass = load_bmp('grass32.png')
	
	bricks = create_bitmap(SCREEN_W, SCREEN_H)
	
	bitmap = create_bitmap(datamap_width, datamap_height)

	gridmap = create_bitmap(datamap_width, datamap_height)
	grid_slice = load_bmp('grid_slice32.png')

	// hit = load_sample('hit.mp3')

	ready(function(){
		init_bitmaps()
		loop(function(){
			clear_to_color(canvas,makecol(255,255,255));
			update();
			draw();
		},BPS_TO_TIMER(60));
	});
	return 0;
}
// END_OF_MAIN();

function checkColision() {

}

function draw_brick_grid(mouse_x,mouse_y) {
	let [x, y] = [mouse_x * grid_size + 16,mouse_y * grid_size + 16]
	draw_brick(x,y)
}

function draw_brick(x,y) {
	bricksObjects.push({x: x, y: y})
	draw_sprite(bricks, brick, x, y)
}

function getBrick(x, y) {
	return bricksObjects.filter((brick) => brick.x == x && brick.y == y)[0]
}

function removeBlock(x,y) {
	return bricksObjects.filter((brick) => brick.x != x || brick.y != y)
}

function automatan() {

}

var tree = {
	lifeExpectancy: 1500*365,
	
}

function mod(n, m) {
	return ((n % m) + m) % m;
}

function walker_step(origin, steps, initial_direction) {
	let position = {x: origin.x, y: origin.y}
	var directions = {
		'L':{x: -1, y: 0},
		'U':{x: 0, y: -1},
		'R':{x: 1, y: 0},
		'D':{x: 0, y: 1},
	}
	let direction_list = ['L','U','R','D']
	if (!initial_direction in directions) {
		initial_direction = direction_list[rand() % 4]
	}
	let current_index = direction_list.indexOf(initial_direction)
	let new_direction;
	let new_position;
	let s = 1;
	while (s <= steps) {
		current_index = mod((current_index + mod(rand(),3) - 1), 4)
		new_direction = direction_list[current_index]
		new_position = {
			x: position.x + directions[new_direction].x,
			y: position.y + directions[new_direction].y,
		}
		if (0 > new_position.x || grid_width < new_position.x
			|| 0 > new_position.y || grid_height < new_position.y) {
			current_index = mod(current_index + 2, 4)
			new_direction = direction_list[current_index]
			new_position.x = position.x + directions[new_direction].x
			new_position.y = position.y + directions[new_direction].y
		}
		position = new_position
		draw_brick_grid(position.x, position.y)
		s += 1
	}
	return {
		position: position,
		direction: new_direction,
	}
}

function download(filename) {
    var pom = document.createElement('a');
    pom.setAttribute('href', bitmap.canvas.toDataURL());
    pom.setAttribute('download', filename);

    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    } else {
        pom.click();
    }
}