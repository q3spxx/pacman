var map, imgs = [], anim = [], text_buf = [], audio = [], audio_mess = [];
var color = [];
var room_t = null;
var Sounds = {};
var Imgs = {};
color['white'] = '255,255,255';

function init () {
	_data.canvas.setSize(672, 672);
	map = _data.canvas.getContext();

	document.getElementById('volume').value = _data.volume * 100;

	Imgs.map = _data.img.load("images/map.png") 
	imgs.push(Imgs.map);
	Imgs.pacman = _data.img.load("images/pacman.png")
	imgs.push(Imgs.pacman);
	Imgs.blinky = _data.img.load("images/blinky.png")
	imgs.push(Imgs.blinky);
	Imgs.pinky = _data.img.load("images/pinky.png")
	imgs.push(Imgs.pinky);
	Imgs.bob = _data.img.load("images/bob.png")
	imgs.push(Imgs.bob);
	Imgs.paul = _data.img.load("images/paul.png")
	imgs.push(Imgs.paul);
	Imgs.fear = _data.img.load("images/fear.png")
	imgs.push(Imgs.fear);
	Imgs.fear_pre_timeout = _data.img.load("images/fear_pre_timeout.png")
	imgs.push(Imgs.fear_pre_timeout);
	Imgs.dead = _data.img.load("images/dead.png")
	imgs.push(Imgs.dead);
	Imgs.cord = _data.img.load("images/special.png");
	imgs.push(Imgs.cord);
	Imgs.yo = _data.img.load("images/yo.png");
	imgs.push(Imgs.yo);
	Imgs.go_to_room = _data.img.load("images/go_to_room.png");
	imgs.push(Imgs.go_to_room);
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
	audio_mess.push(Sounds.firstblood)
	Sounds.doublekill = _data.audio.load("audio/doublekill.mp3");
	audio.push(Sounds.doublekill);
	audio_mess.push(Sounds.doublekill)
	Sounds.scream = _data.audio.load("audio/scream.mp3");
	audio.push(Sounds.scream);
	audio_mess.push(Sounds.scream)
	Sounds.multikill = _data.audio.load("audio/multikill.mp3");
	audio.push(Sounds.multikill);
	audio_mess.push(Sounds.multikill)
	Sounds.megakill = _data.audio.load("audio/megakill.mp3");
	audio.push(Sounds.megakill);
	audio_mess.push(Sounds.megakill)
	Sounds.rampage = _data.audio.load("audio/rampage.mp3");
	audio.push(Sounds.rampage);
	audio_mess.push(Sounds.rampage)
	Sounds.unstoppable = _data.audio.load("audio/unstoppable.mp3");
	audio.push(Sounds.unstoppable);
	audio_mess.push(Sounds.unstoppable)
	Sounds.dominating = _data.audio.load("audio/dominating.mp3");
	audio.push(Sounds.dominating);
	audio_mess.push(Sounds.dominating)
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
	Player.img = Imgs.pacman;
	Blinky.set_original_img();
	Pinky.set_original_img();
	Bob.set_original_img();
	Paul.set_original_img();
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
	if (Room.list[0]) {
		Room.list[0].exit_from_room();
	};
};

function init_enemy_position () {
	Room.list = []
	Blinky.pos = {
		x: 320,
		y: 224
	}
	Blinky.point_pos = {
		x: 10,
		y: 7
	}
	Blinky.path = []
	b_Controller.set_passive.call(Blinky)
	Pinky.pos = {
		x: 320,
		y: 288
	}
	Pinky.point_pos = {
		x: 10,
		y: 9
	}
	Pinky.path = []
	Room.enter.call(Pinky);
	Bob.pos = {
		x: 288,
		y: 288
	}
	Bob.point_pos = {
		x: 9,
		y: 9
	}
	Bob.path = []
	Room.enter.call(Bob);
	Paul.pos = {
		x: 352,
		y: 288
	}
	Paul.point_pos = {
		x: 11,
		y: 9
	}
	Paul.path = []
	Room.enter.call(Paul);
}

function active_enemyes () {
	init_enemy_position();
	Controller.start.call(Blinky);
	Controller.start.call(Pinky);
	Controller.start.call(Bob);
	Controller.start.call(Paul);
	Controller.start.call(Player);
	gl.start();
	Controller.game_pause();
	_data.status = "ready";
	_data.set_center_mess("press enter");
	_data.center_mess_switch = true;
};

function start () {
	_data.center_mess_switch = false;
	_data.status = "play";
	Sounds.begin.play();
	setTimeout(start_game, 4000);
};
function start_game () {
	Sounds.signal.play()
	Event.set_random_event();
	setInterval(function () {
		if (_data.status == "play") {
			room_timer();
		};
	}, 5000);
	console.log("start game")
	Controller.game_continue();
};

window.onload = init();