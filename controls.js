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
	checkButtonStatus: function (e) {
		for (var i = 0; i < Controls.buttons[e.key].statuses.length; i++) {
			if (Controls.buttons[e.key].statuses[i] == _Data.status) {
				return false
			}
		}
		return true
	},
	handler: function (e) {
		if (!(e.key in Controls.buttons)) {
			return
		}

		if (Controls.checkButtonStatus(e)) {
			return
		}

		if (e.type == "keydown") {
			e.preventDefault();
			switch (e.key) {
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
				case 'q': if (Special.cord.ready && Special.cord.level > 0) {Special.cord.start()};
				break
				case 32: if (_Data.status == 'shop') {
							Shop.try_buy()
						} else if (Special.yo.status) {
							Event.start()
						};
				break
				case 'Enter': if (_Data.status == 'ready') {
						Game.begin()
					} else if (_Data.status == 'shop') {
						Shop.close()
					}
				break
				case 82: if (Special.bomb.ready && Special.bomb.level > 0) {Special.bomb.start()}
				break
				case 'w': if (Special.shot.ready && Special.shot.level > 0) {Special.shot.start()};
				break
				case 'e': if (Special.shock.ready && Special.shock.level > 0) {Special.shock.start()}
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
			statuses: ['isRunned']
		},
		ArrowRight: {
			statuses: ['isRunned']
		},
		ArrowDown: {
			statuses: ['isRunned']
		},
		Enter: {
			statuses: ['ready']
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
		}
	}
};