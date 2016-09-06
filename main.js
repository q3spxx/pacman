var Timer = {
	time: '',
	start: function () {
		var date = new Date()
		this.time = date.getTime()
	},
	stop: function () {
		var date = new Date()
		console.log(date.getTime() - this.time)
	}
}

var Game = {
	status: 0,
	init: function () {
		Timer.start()
		this.changeInit()

	},
	changeInit: function () {
		switch (this.status) {
			case 0:
				console.log("Инициализация html элементов...") 
				this.initHtml()
				break
			case 1: 
				console.log("Загрузка изображений...")
				this.loadImages()
				break
			case 2: 
				console.log("Загрузка аудио...")
				this.loadAudio()
				break
			case 3: 
				console.log("Инициализация блоков...")
				this.initBlocks()
				break
			case 4:
				console.log("Создание карты...")
				this.initMap()
				break
		}
	},
	initHtml: function () {
		_Tools.canvas.setElem(document.getElementById("map"))
		_Tools.canvas.setSize(672, 672);
		map = _Tools.canvas.getContext('2d');

		_Tools.inputs.volume.setValue(_Data.volume)
		this.status = 1
		this.changeInit()
	},
	loadImages: function () {
		for (key in image_src) {
			Imgs[key] = _Tools.img.load("images/" + image_src[key])
			imgs.push(Imgs[key])
		}
		for (key in image_icons_src) {
			Imgs.icons[key] = _Tools.img.load("images/" + image_icons_src[key])
			imgs.push(Imgs.icons[key])
		}
		//Инициализация картинок для магазина
		/*Shop.data.catalog.products[0].icon = Imgs.icons.cord
		Shop.data.catalog.products[1].icon = Imgs.icons.shot
		Shop.data.catalog.products[2].icon = Imgs.icons.shock
		Shop.data.catalog.products[3].icon = Imgs.icons.bomb
		Shop.data.catalog.products[4].icon = Imgs.pacman*/
		_Tools.img.handle = setInterval(
			function () {
				if (_Tools.img.count == _Tools.img.loaded) {
					clearInterval(_Tools.img.handle);
					console.log("Загрузка изображений 100%")
					this.status = 2
					this.changeInit()
				} else {
					console.log(Math.floor(_Tools.img.loaded / _Tools.img.count * 100) + " %")
				};
			}.bind(this), 10);
	},
	loadAudio: function () {
		for (key in audio_src) {
			Sounds[key] = _Tools.audio.load('audio/' + audio_src[key])
			audio.push(Sounds[key])
		}
		for (key in audio_mess_src) {
			Sounds[key] = _Tools.audio.load('audio/' + audio_mess_src[key])
			audio.push(Sounds[key])
			audio_mess.push(Sounds[key])
		}

		Sounds.signal.loop = true;
		Sounds.shop.loop = true

		audio.forEach(function (sound) {
				sound.volume = _Data.volume;
		})
		console.log("Загрузка аудио 100%")
		this.status = 3
		this.changeInit()
	},
	initBlocks: function () {
		Blocks.setDefault()
		StaticObjects.init()
		DynamicObjects.init()
		EventBlocks.set_default()
		this.status = 4
		this.changeInit()
	},
	initMap: function () {
		_Map.createGrid()
		console.log("Инициализация карты...")
		_Map.init()
		return
		_Map.createGraph()
		_Map.update()
		_Map.create_event_graph()
		character_init()
	}
}

function character_init () {
	var character = new Character()
	player_init(character);
	enemies_init(character);
	init_enemy_position();
	anim_init();
}

function player_init (character) {
	Player = new _Player()
	Player.__proto__ = character;
	Player.action.push({
			frames: [
				{
					x: 0,
					y: 0
				},
				{
					x: 32,
					y: 0
				},
				{
					x: 64,
					y: 0
				},
				{
					x: 96,
					y: 0
				},
				{
					x: 128,
					y: 0
				}
			]
		})
};

function enemies_init (character) {
	var ai_prototype = new AI_Prototype();
	ai_prototype.__proto__ = character

	Blinky = new _Enemy(0, {x: 320, y: 224}, Imgs.blinky, {x: 10, y: 7}, 'passive')
	Blinky.__proto__ = ai_prototype

	Pinky = new _Enemy(1, {x: 320, y: 288}, Imgs.pinky, {x: 10, y: 9}, 'enter_to_room')
	Pinky.__proto__ = ai_prototype

	Bob = new _Enemy(2, {x: 288, y: 288}, Imgs.bob, {x: 9, y: 9}, 'enter_to_room')
	Bob.__proto__ = ai_prototype

	Paul = new _Enemy(3, {x: 352, y: 288}, Imgs.paul, {x: 11, y: 9}, 'enter_to_room')
	Paul.__proto__ = ai_prototype

	enemy_arr.push(Blinky, Pinky, Bob, Paul)
};

function anim_init () {
	init_type();
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
	change_buf_event_frame();
	init_controls();
};

function init_controls () {
	Controls.keyDown.on();
	Controls.keyUp.on();
	ready();
};

function init_player_position () {

	Player.stop()
	Player.img = Imgs.pacman;
	Player.curAction = 0;

	var aBuf = new AnimBuf(0, Player, 2, true);

	anim[0] = aBuf;

	Player.pos.x = 320;
	Player.pos.y = 480;
}

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
	Blinky.img = Imgs.blinky
	Blinky.curAction = 0
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
	Pinky.img = Imgs.pinky
	Pinky.curAction = 0
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
	Bob.img = Imgs.bob
	Bob.curAction = 0
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
	Paul.img = Imgs.paul
	Paul.curAction = 0
	Room.enter.call(Paul);
}

function ready () {
	gl.start();
	_data.status = "ready";
	_data.center_mess_switch = true;
	_data.set_center_mess("press enter");
};

function start () {
	_data.center_mess_switch = true;
	_data.set_center_mess("Level: " + _data.level);
	_data.status = "play";
	Sounds.begin.play();
	setTimeout(start_game, 4000);
};
function start_game () {
	_data.center_mess_switch = false;
	Sounds.signal.play()
	if (!Event.random_event) {
		Event.set_random_event();
	};
	if (!Event.buf_event) {
		Event.set_buf_event()
	};
	Room.handle = setInterval(function () {
		if (_data.status == "play") {
			if (Room.list[0]) {
				Room.list[0].exit_from_room();
			};
		};
	}, 5000);
	console.log("start game")
	Controller.game_continue();
};

window.onload = Game.init();