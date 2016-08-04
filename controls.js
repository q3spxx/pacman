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
		if (_data.status == "special" ||
			_data.status == "pause") {
			Player.set_stop();
			return;
		};
		if (e.type == "keydown") {
			e.preventDefault();
			switch (e.keyCode) {
				case 37: Player.set_left()
				break
				case 38: Player.set_up()
				break
				case 39: Player.set_right()
				break
				case 40: Player.set_down()
				break
				case 81: Special.get_over_here.start();
				break
				case 32: if (Special.yo.status) {Event.start()}
				break
			}
			
		};
		if (e.type == "keyup") {
			//Player.set_stop()
		};
	}
};