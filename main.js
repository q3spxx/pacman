var map, imgs = [], anim = [], text_buf = [];
var color = [];
color['white'] = '255,255,255';

function init () {
	_data.canvas.setSize(672, 672);
	map = _data.canvas.getContext();

	imgs.push(_data.img.load("images/map.png"));
	imgs.push(_data.img.load("images/pacman.png"));
	imgs.push(_data.img.load("images/blinky.png"));
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
	Map.addElem(door);
	Map.addElem(food);
	Map.addElem(energiser);
	Map.createGraph();
	player_init();
	enemies_init();
	animInit();
};

function player_init () {
	Scope.main = 0;
};

function enemies_init () {
	Blinky.__proto__ = new AI_Prototype();
};

function animInit () {
	init_type();
	Player.img = imgs[1];
	Blinky.img = imgs[2];
	var aBuf = new AnimBuf(0, Player);
	anim.push(aBuf);
	aBuf = new AnimBuf(1, Blinky);
	anim.push(aBuf);
	//Blinky.setBehavior(0);
	Anim.handle = setInterval(Anim.change_frame, 200);
	Anim.handle = setInterval(Anim.change_text_frame, 33);
	initControls();
};

function initControls () {
	Controls.keyDown.on();
	Controls.keyUp.on();
	gl.start();
};

window.onload = init();