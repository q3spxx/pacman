var Timer = {
	time: '',
	start: function () {
		var date = new Date()
		this.time = date.getTime()
	},
	stop: function () {
		var date = new Date()
		console.log(date.getTime() - this.time + " ms")
	}
}

var Game = {
	status: 0,
	init: function () {
		Timer.start()
		this.changeInit()
		_Data.status = "init";

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
			case 5:
				console.log("Инициализация анимаций...")
				this.initAnim()
				break
			case 6:
				console.log("Инициализация персонажей...")
				this.initCharacter()
				break
			case 7:
				console.log("Инициализация ввода...")
				this.initControls()
				break
			case 8:
				console.log("Инициализация сообщений...")
				this.initMess()
				break
			case 9:
				console.log("Запуск рендера, предстартовая проверка...")
				this.ready()
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
		for (key in audioSrc) {
			Sounds[key] = _Tools.audio.load('audio/' + audioSrc[key])
			audio.push(Sounds[key])
		}
		for (key in audioMessSrc) {
			Sounds[key] = _Tools.audio.load('audio/' + audioMessSrc[key])
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
		EventBlocks.setDefault()
		MapObjects.init()
		this.status = 4
		this.changeInit()
	},
	initMap: function () {
		_Map.createGrid()
		console.log("Инициализация карты...")
		_Map.init()
		_Map.createGraph()
		_Map.createEventGraph()
		this.status = 5
		this.changeInit()
	},
	initAnim: function () {
		Anim.init();
		this.status = 6
		this.changeInit()
	},
	initCharacter: function () {
		var character = new Character()
		Char.playerInit(character);
		Char.enemiesInit(character);
		this.status = 7
		this.changeInit()
	},
	initControls: function () {
		Controls.keyDown.on();
		Controls.keyUp.on();
		this.status = 8
		this.changeInit()
	},
	initMess: function () {
		Mess.init()
		Outputs.init()
		this.status = 9
		this.changeInit()
	},
	ready: function () {
		gl.start();
		_Data.status = "ready";
		Mess.setMess('pressEnter')
		this.status = 10
		Timer.stop()
	},
	begin: function () {
		Mess.hideMess('pressEnter')
		Mess.setMess('level')
		Sounds.begin.play();
		setTimeout(function () {
			Game.start()
		}, 4000);
	},
	start: function () {
		_Data.status = "isRunned";
		Controller.start.call(Player)
		Controller.start.call(Blinky)
		Controller.start.call(Pinky)
		Controller.start.call(Bob)
		Controller.start.call(Paul)
		Room.start()
	},
	pause: function () {
		_Data.intervals.forEach(function (interval) {
			interval.pause()
		})
		_Data.timeouts.forEach(function (timeout) {
			timeout.pause()
		})
		_Data.status = 'pause'
	},
	continue: function () {
		_Data.intervals.forEach(function (interval) {
			interval.continue()
		})
		_Data.timeouts.forEach(function (timeout) {
			timeout.continue()
		})
		_Data.status = 'isRunned'
	},
	stop: function () {
		Room.stop()
		Controller.stop.call(Player)
		enemyArr.forEach(function (enemy) {
			Controller.stop.call(enemy)
		})
		if (Events.energiser.timer) {
			Events.energiser.removeTimer()
		}
		if (Events.energiser.activated) {
			Events.energiser.deactivate()
		}
	},
	default: function () {
		Player.setDefault()
		enemyArr.forEach(function (enemy) {
			enemy.setDefault()
		})
		_Data.status = 'ready'
	},
	nextRound: function () {

	}
}


function initEnemyPosition () {
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
	b_Controller.setPassive.call(Blinky)
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