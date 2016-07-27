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
				Controller.start.call(Player);
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