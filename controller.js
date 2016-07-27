var Controller = {
		start: function () {
			var self = this;

			self.handle = setInterval(function () {

				if (self.id != 4) {
					if (self.behavior == 0) {
						ai.search_path.call(self);
					};
					if (self.behavior == 1) {
						ai.fear.call(self);
					};
					if (self.behavior == 2) {
						ai.passive.call(self);
					};
					Move.ai_arrows.call(self);
				};
				if (self.id == 4) {
					ai.player_pos.x = Math.floor((self.pos.x) / 32);
					ai.player_pos.y = Math.floor((self.pos.y) / 32);
				};

		 		var res = Move.set.call(self);
		 		if (!res) {
		 			Controller.stop.call(self);
		 		};
			}, self.speed);
		},
		stop: function () {
			clearInterval(this.handle);
		}
	};

	var b_Controller = {
		check_visibility: function () {
			var pos = {
				x: Math.floor(this.pos.x / 32),
				y: Math.floor(this.pos.y / 32)
			};

			var axis = null;
			var in_line = null;
			if (pos.x != ai.player_pos.x) {
				if (pos.y != ai.player_pos.y) {
					return false;
				} else {
					axis = 1;
				};
			} else {
				axis = 0;
			};

			if (axis == 0) {
				if (this.m_pos.y == 1) {
					in_line = ai.player_pos.y - pos.y;
				} else if (this.m_pos.y == -1) {
					in_line = pos.y - ai.player_pos.y;
				} else {
					return false;
				};
			} else if (axis == 1) {
				if (this.m_pos.x == 1) {
					in_line = ai.player_pos.x - pos.x;
				} else if (this.m_pos.x == -1) {
					in_line = pos.x - ai.player_pos.x;
				} else {
					return false;
				};
			} else {
				return false
			};

			if (in_line < 0) {
				return false;
			};

			while (pos.x != ai.player_pos.x && pos.y != ai.player_pos.y) {
				if (Map.grid[pos.x][pos.y].block) {
					return false;
				};
				pos.x += this.m_pos.x;
				pos.y += this.m_pos.y;
			};

			return true;
		},
		set_chase: function () {
			this.behavior = 0;
			this.point_pos = ai.player_pos;
		},
		set_fear: function () {
			this.behavior = 1;
		},
		set_passive: function () {
			this.behavior = 2;
		},
		set_waiting: function () {
			this.behavior = 3;
		}
	};

	var Event = {
		handle: null,
		date: null,
		status: 0,
		duration: 10000,
		start: function () {
			var date = new Date();
			Event.date = date.getTime();
			Event.status = 1;
			enemy_arr.forEach(function (enemy) {
				b_Controller.set_fear.call(enemy);
			});
			console.log("start");
			if (Event.handle != null) {
				clearInterval(Event.handle);
			};
			Event.handle = setInterval(function () {
				Event.check_end();
			}, 35);
		},
		stop: function () {
			clearInterval(Event.handle);
			Event.handle == null;
			Event.date = null;
			Event.status = 0;
			enemy_arr.forEach(function (enemy) {
				b_Controller.set_passive.call(enemy);
			});
			console.log("stop");
		},
		check_end: function () {
			var date = new Date();
			if (date.getTime() - Event.date > Event.duration) {
				Event.stop();
			};
		}
	}