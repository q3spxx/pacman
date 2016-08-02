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
		if (_data.status != "play") {
			Controls.down = false;
			Player.m_pos.x = 0;
			Player.m_pos.y = 0;
			return;
		};
		if (e.type == "keydown") {
			if (e.keyCode == 37) {
				//left
				if (Controls.down) {
					return false;
				};
				Controls.down = true;
				Player.m_pos.x = -1;
				Player.m_pos.y = 0;
				Player.curAction = 0;
				Controller.start.call(Player);
			} else if (e.keyCode == 38) {
				//up
				if (Controls.down) {
					return false;
				};
				Controls.down = true;
				Player.m_pos.x = 0;
				Player.m_pos.y = -1;
				Player.curAction = 1;
				Controller.start.call(Player);
			} else if (e.keyCode == 39) {
				//right
				if (Controls.down) {
					return false;
				};
				Controls.down = true;
				Player.m_pos.x = 1;
				Player.m_pos.y = 0;
				Player.curAction = 2;
				Controller.start.call(Player);
			} else if (e.keyCode == 40) {
				//down
				if (Controls.down) {
					return false;
				};
				Controls.down = true;
				Player.m_pos.x = 0;
				Player.m_pos.y = 1;
				Player.curAction = 3;


				if  (
					Math.floor(Player.pos.x / 32) == 9 && Math.floor(Player.pos.y / 32) == 7 ||
					Math.floor(Player.pos.x / 32) == 10 && Math.floor(Player.pos.y / 32) == 7 ||
					Math.floor(Player.pos.x / 32) == 11 && Math.floor(Player.pos.y / 32) == 7
					) {
					return false;
				}
				Controller.start.call(Player);
			} else if (e.keyCode == 81) {
				Special.get_over_here.start();
			} else if (e.keyCode == 32) {
				if (Special.yo.status) {
					Event.start();
				};
			};
		} else if (e.type == "keyup") {
			if (Controls.down) {
				Controls.down = false;
				Player.m_pos.x = 0;
				Player.m_pos.y = 0;
				Controller.stop.call(Player);
			};
		};
	}
};