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
	handle: null,
	fps: 30,
	speed: 5,
	render: [],
	timeMap: [],
	interval: null,
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

		$('body').on('mousemove', function (e) {
			e.isDefaultPrevented()
			_Tools.inputs.volume.changeVolume(e)
		})
		$('#volume').on('mousedown', function (e) {
			e.isDefaultPrevented()
			_Tools.inputs.volume.y = e.clientY
			_Tools.inputs.volume.mousedownEnable(e)
		})
		$('#volume').on('mouseup', function (e) {
			e.isDefaultPrevented()
			_Tools.inputs.volume.mousedownDisable()
		})
		_Tools.inputs.volume.rotate()
		this.status = 1
		this.changeInit()
	},
	loadImages: function () {
		for (key in imageSrc) {
			Imgs[key] = _Tools.img.load("images/" + imageSrc[key])
			imgs.push(Imgs[key])
		}
		for (key in imageIconsSrc) {
			Imgs.icons[key] = _Tools.img.load("images/" + imageIconsSrc[key])
			imgs.push(Imgs.icons[key])
		}
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

		Sounds.changeVolume()

		Sounds.signal.loop = true;
		Sounds.shop.loop = true

		console.log("Загрузка аудио 100%")
		this.status = 3
		this.changeInit()
	},
	initBlocks: function () {
		Blocks.setDefault()
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
		ai.passive.init()
		Events.gain.init()
		Shop.init()
		Special.icons.init()
		_Tools.setInterval.call(gl, gl.clear, Math.floor(1000 / this.fps))
		_Tools.setInterval.call(gl, gl.map, Math.floor(1000 / this.fps))
		_Tools.setInterval.call(gl, gl.lowLayerRender, Math.floor(1000 / this.fps))
		_Tools.setInterval.call(gl, gl.effectsRender, Math.floor(1000 / this.fps))
		_Tools.setInterval.call(gl, gl.animationRender, Math.floor(1000 / this.fps))
		_Tools.setInterval.call(gl, gl.highLayerRender, Math.floor(1000 / this.fps))
		_Tools.setInterval.call(gl, gl.messageRender, Math.floor(1000 / this.fps))
		_Tools.setInterval.call(gl, gl.outputsRender, Math.floor(1000 / this.fps))
		_Tools.setInterval.call(gl, gl.shopRender, Math.floor(1000 / this.fps))
		_Tools.setInterval.call(gl, gl.emittersRender, Math.floor(1000 / this.fps))
		_Tools.setInterval.call(gl, gl.fpsTimer, Math.floor(1000 / this.fps))
		_Tools.setInterval.call(gl, gl.postRender, Math.floor(1000 / this.fps))
		Game.loop()
		Anim.handle = _Tools.setInterval.call(Anim, Anim.changeFrame, 200);
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
		Sounds.fon.play()
		Controller.start.call(Player)
		Controller.start.call(Blinky)
		Controller.start.call(Pinky)
		Controller.start.call(Bob)
		Controller.start.call(Paul)
		Room.start()
		Events.gain.countDown()
		Events.tosty.countDown()
	},
	pause: function () {
		Sounds.fon.pause()
		Game.interval.pause()
		_Data.timeouts.forEach(function (timeout) {
			timeout.pause()
		})
		_Data.status = 'pause'
	},
	continue: function () {
		Sounds.fon.play()
		Game.interval.continue()
		_Data.timeouts.forEach(function (timeout) {
			timeout.continue()
		})
		_Data.status = 'isRunned'
	},
	stop: function () {
		Room.stop()
		Room.setDefault()
		Events.gain.setDefault()
		Events.tosty.setDefault()
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
		Special.setAllDefault()
		_Data.status = 'ready'
	},
	nextRound: function () {
		_Data.level++
		_Data.roundDefault()

		Game.default()
		_Map.default()
		Game.begin()
	},
	loop: function () {
		this.interval = new Interval(function () {
			TimeMap.formation()
			while (this.timeMap.length > 0) {
				this.timeMap[0].method.call(this.timeMap[0].context)
				this.timeMap.splice(0, 1)
			}
		}.bind(this), this.speed)
	},
	addRenderBuffer: function (name, method) {
		if (name == undefined || method == undefined) {
			return false
		}
		var renderBuffer = new RenderBuffer(name, method)
		this.render.push(renderBuffer)
		return true
	},
	removeRenderBuffer: function (name) {
		for (var i = 0; i < this.render.length; i++) {
			if (name == this.render[i].name) {
				this.render.splice(i, 1)
				return true
			}
		}
		return false
	},
	enableBuffer: function (name) {
		for (var i = 0; i < this.render.length; i++) {
			if (name == this.render[i].name) {
				this.render[i].enable()
				return true
			}
		}
		return false
	},
	disableBuffer: function (name) {
		for (var i = 0; i < this.render.length; i++) {
			if (name == this.render[i].name) {
				this.render[i].disable()
				return true
			}
		}
		return false
	}
}

window.onload = Game.init();