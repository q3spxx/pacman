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
	handler: function (e) {
		/*if (_data.status == "special" ||
			_data.status == "pause") {
			Player.stop();
			return;
		};*/
		if (e.type == "keydown") {
			e.preventDefault();
			switch (e.keyCode) {
				case 37: Player.left()
				break
				case 38: if (_Data.status == 'shop') {
							Shop.cursor.up()
						} else {
							Player.up()
						};
				break
				case 39: Player.right()
				break
				case 40: if (_Data.status == 'shop') {
							Shop.cursor.down()
						} else {
							Player.down()
						};
				break
				case 81: if (Special.get_over_here.ready && Special.get_over_here.level > 0) {Special.get_over_here.start()};
				break
				case 32: if (_Data.status == 'shop') {
							Shop.try_buy()
						} else if (Special.yo.status) {
							Event.start()
						};
				break
				case 13: if (_Data.status == 'ready') {
						start()
					} else if (_Data.status == 'shop') {
						Shop.close()
					}
				break
				case 82: if (Special.bomb.ready && Special.bomb.level > 0) {Special.bomb.start()}
				break
				case 87: if (Special.shot.ready && Special.shot.level > 0) {Special.shot.start()};
				break
				case 69: if (Special.shock.ready && Special.shock.level > 0) {Special.shock.start()}
				break
			}
			
		};
		if (e.type == "keyup") {
			//Player.set_stop()
		};
	}
};