var Controls = {
	down: false,
	keyDown: {
		on: function () {
			window.addEventListener("keydown", Controls.handler);
		},
		off: function () {
			window.removeEventListener("keydown", Controls.handler);
		}
	},
	keyUp: {
		on: function () {
			window.addEventListener("keyup", Controls.handler);
		},
		off: function () {
			window.removeEventListener("keyup", Controls.handler);
		}
	},
	checkButtonStatus: function (button) {
		for (var i = 0; i < Controls.buttons[button].statuses.length; i++) {
			if (Controls.buttons[button].statuses[i] == _Data.status) {
				return false
			}
		}
		return true
	},
	handler: function (e) {
		var button = Controls.getButton(e)
		if (!(button in Controls.buttons)) {
			return
		}

		if (Controls.checkButtonStatus(button)) {
			return
		}

		if (e.type == "keydown") {
			e.preventDefault();
			switch (button) {
				case 'ArrowLeft': Player.left()
				break
				case 'ArrowUp': if (_Data.status == 'shop') {
							Shop.cursor.up()
						} else {
							Player.up()
						};
				break
				case 'ArrowRight': Player.right()
				break
				case 'ArrowDown': if (_Data.status == 'shop') {
							Shop.cursor.down()
						} else {
							Player.down()
						};
				break
				case 'Space': if (_Data.status == 'shop') {
							Shop.tryBuy()
						} else if (Special.yo.status) {
							Event.start()
						};
				break
				case 'Enter': if (_Data.status == 'ready') {
						Game.begin()
					} else if (_Data.status == 'shop') {
						Shop.close()
						Game.nextRound()
					}
				break
				case 'q': if (Special.cord.ready && Special.cord.level > 0) {Special.cord.start()};
				break
				case 'w': if (Special.shot.ready && Special.shot.level > 0) {Special.shot.start()};
				break
				case 'e': if (Special.shock.ready && Special.shock.level > 0) {Special.shock.start()}
				break
				case 'r': if (Special.bomb.ready && Special.bomb.level > 0) {Special.bomb.start()}
				break
				case 'Escape':
					if (_Data.status == 'pause') {
						setTimeout(function () {
							Game.continue()
						}, Game.speed * 3)
						Mess.hideMess('pause')
					} else {
						Mess.setMess('pause')
						setTimeout(function () {
							Game.pause()
						}, Game.speed * 3)
					};
			}
			
		};
		if (e.type == "keyup") {
			//Player.set_stop()
		};
	},
	buttons: {
		ArrowLeft: {
			statuses: ['isRunned']
		},
		ArrowUp: {
			statuses: ['isRunned', 'shop']
		},
		ArrowRight: {
			statuses: ['isRunned']
		},
		ArrowDown: {
			statuses: ['isRunned', 'shop']
		},
		Enter: {
			statuses: ['ready', 'shop']
		},
		Escape: {
			statuses: ['isRunned', 'pause', 'playerIsDead', 'special']
		},
		w: {
			statuses: ['isRunned']
		},
		q: {
			statuses: ['isRunned']
		},
		e: {
			statuses: ['isRunned']
		},
		r: {
			statuses: ['isRunned']
		},
		Space: {
			statuses: ['isRunned', 'shop']
		}
	},
	getButton: function (e) {
		switch(e.keyCode) {
			case 37: return "ArrowLeft"
			case 38: return "ArrowUp"
			case 39: return "ArrowRight"
			case 40: return "ArrowDown"
			case 81: return "q"
			case 87: return "w"
			case 69: return "e"
			case 82: return "r"
			case 27: return "Escape"
			case 32: return "Space"
			case 13: return "Enter"
			default: return 'unknown'
		} 
	}
};