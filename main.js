var map, imgs = [], anim = [], text_buf = [];
var color = [];
var room_t = null;
color['white'] = '255,255,255';

function init () {
	_data.canvas.setSize(672, 672);
	map = _data.canvas.getContext();

	imgs.push(_data.img.load("images/map.png"));
	imgs.push(_data.img.load("images/pacman.png"));
	imgs.push(_data.img.load("images/blinky.png"));
	imgs.push(_data.img.load("images/pinky.png"));
	imgs.push(_data.img.load("images/bob.png"));
	imgs.push(_data.img.load("images/paul.png"));
	imgs.push(_data.img.load("images/fear.png"));
	_data.img.handle = setInterval(loading, 100);
};

function loading () {
	if (_data.img.count == _data.img.loaded) {
		clearInterval(_data.img.handle);
		createMap();
	};
};

function createMap () {
	empty = initEmpty();
	walls = initWalls();
	door = initDoor();
	food = initFood();
	energiser = initEnergiser();
	Map.addElem(empty);
	Map.addElem(walls);
	Map.addElem(food);
	Map.addElem(energiser);
	Map.createGraph();
	Map.addElem(door);
	player_init();
	enemies_init();
	animInit();
};

function player_init () {
	Scope.main = 0;
};

function enemies_init () {
	Blinky.__proto__ = new AI_Prototype();
	Pinky.__proto__ = new AI_Prototype();
	Bob.__proto__ = new AI_Prototype();
	Paul.__proto__ = new AI_Prototype();
};

function animInit () {
	init_type();
	Player.img = imgs[1];
	Blinky.img = imgs[2];
	Pinky.img = imgs[3];
	Bob.img = imgs[4];
	Paul.img = imgs[5];
	var aBuf = new AnimBuf(0, Player);
	anim.push(aBuf);
	aBuf = new AnimBuf(1, Blinky);
	anim.push(aBuf);
	aBuf = new AnimBuf(2, Pinky);
	anim.push(aBuf);
	aBuf = new AnimBuf(3, Bob);
	anim.push(aBuf);
	aBuf = new AnimBuf(4, Paul);
	anim.push(aBuf);
	Anim.handle = setInterval(Anim.change_frame, 200);
	Anim.handle = setInterval(Anim.change_text_frame, 33);
	initControls();
};

function initControls () {
	Controls.keyDown.on();
	Controls.keyUp.on();
	active_enemyes();
};

function room_timer () {
	if (room.length != 0) {
		room[0].exit_from_room();
	};
};

function active_enemyes () {
	room.push(Pinky);
	room.push(Bob);
	room.push(Paul);
	Controller.start.call(Blinky);
	Controller.start.call(Pinky);
	Controller.start.call(Bob);
	Controller.start.call(Paul);
	gl.start();
	room_t = setInterval(function () {
		room_timer();
	}, 5000);
};

window.onload = init();