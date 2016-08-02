var map, imgs = [], anim = [], text_buf = [], audio = [];
var color = [];
var room_t = null;
var Sounds = {};
var Imgs = {};
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
	imgs.push(_data.img.load("images/dead.png"));
	Imgs.cord = _data.img.load("images/special.png");
	imgs.push(Imgs.cord);
	Imgs.yo = _data.img.load("images/yo.png");
	imgs.push(Imgs.yo);
	_data.img.handle = setInterval(loading, 100);
};

function loading () {
	if (_data.img.count == _data.img.loaded) {
		clearInterval(_data.img.handle);
		load_audio();
	};
};
function load_audio () {
	Sounds.get_over_here = _data.audio.load("audio/goh.mp3");
	audio.push(Sounds.get_over_here);
	Sounds.yo = _data.audio.load("audio/yo.mp3");
	audio.push(Sounds.yo);
	Sounds.dead = _data.audio.load("audio/dead.mp3");
	audio.push(Sounds.dead);
	Sounds.begin = _data.audio.load("audio/begin.mp3");
	audio.push(Sounds.begin);
	Sounds.step = _data.audio.load("audio/step.mp3");
	audio.push(Sounds.step);
	Sounds.eatghost = _data.audio.load("audio/eatghost.mp3");
	audio.push(Sounds.eatghost);
	Sounds.eatghost = _data.audio.load("audio/eatghost.mp3");
	audio.push(Sounds.eatghost);
	Sounds.signal = _data.audio.load("audio/signal.mp3");
	Sounds.signal.loop = true;
	audio.push(Sounds.signal);
	Sounds.fear = _data.audio.load("audio/fear.mp3");
	audio.push(Sounds.fear);
	Sounds.firstblood = _data.audio.load("audio/firstblood.mp3");
	audio.push(Sounds.firstblood);
	Sounds.doublekill = _data.audio.load("audio/doublekill.mp3");
	audio.push(Sounds.doublekill);
	Sounds.scream = _data.audio.load("audio/scream.mp3");
	audio.push(Sounds.scream);
	Sounds.multikill = _data.audio.load("audio/multikill.mp3");
	audio.push(Sounds.multikill);
	Sounds.megakill = _data.audio.load("audio/megakill.mp3");
	audio.push(Sounds.megakill);
	Sounds.rampage = _data.audio.load("audio/rampage.mp3");
	audio.push(Sounds.rampage);
	Sounds.unstoppable = _data.audio.load("audio/unstoppable.mp3");
	audio.push(Sounds.unstoppable);
	Sounds.dominating = _data.audio.load("audio/dominating.mp3");
	audio.push(Sounds.dominating);
	audio.forEach(function (sound) {
		sound.volume = _data.volume;
	});
	createMap();
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
	var aBuf = new AnimBuf(0, Player, 2, true);
	anim.push(aBuf);
	aBuf = new AnimBuf(1, Blinky, 2, true);
	anim.push(aBuf);
	aBuf = new AnimBuf(2, Pinky, 2, true);
	anim.push(aBuf);
	aBuf = new AnimBuf(3, Bob, 2, true);
	anim.push(aBuf);
	aBuf = new AnimBuf(4, Paul, 2, true);
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
	_data.status = "play";
	Controller.game_pause();
	Sounds.begin.play();
	setTimeout(start_game, 4000);
};

function start_game () {
	Sounds.signal.play()
	Event.set_random_event();
	room_t = setInterval(function () {
		room_timer();
	}, 5000);
	Controller.game_continue();
};

window.onload = init();