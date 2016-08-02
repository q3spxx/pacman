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
					if (self.behavior == 3) {
					};
					if (self.behavior == 4) {
						ai.free.call(self);
					};
					if (self.behavior == 5) {
						ai.free.call(self);
					};
					if (self.behavior == 6) {
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
			}, self.speed/* - Math.round(_data.level * _data.game_speed / 256)*/);
		},
		stop: function () {
			clearInterval(this.handle);
		},
		game_pause: function () {
			_data.status = "pause";
			enemy_arr.forEach(function (enemy) {
				Controller.stop.call(enemy);
			});
			Controller.stop.call(Player);
		},
		game_continue: function () {
			_data.status = "play";
			enemy_arr.forEach(function (enemy) {
				Controller.start.call(enemy)
			});
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
		},
		set_free: function (point) {
			this.point_pos = point;
			this.behavior = 4;
		},
		set_outroom: function (point) {
			this.point_pos = point;
			this.behavior = 5;
		},
		set_grab: function () {
			this.behavior = 6;
			this.m_pos.x = 0;
			this.m_pos.y = 0;
			this.path = [];
		}
	};

	var Event = {
		random_event_date: null,
		random_event_handle: null,
		handle: null,
		date: null,
		status: 0,
		duration: 10000,
		set_random_event: function () {
			var date = new Date();
			Event.random_event_date = date.getTime();
			Event.random_event_date += Math.random() * 300000;
			Event.random_event_handle = setInterval(function () {
				var new_date = new Date();
				var time = new_date.getTime();
				if (time > Event.random_event_date) {
					clearInterval(Event.random_event_handle);
					Special.yo.start();
				};
			}, 100)
		},
		start: function () {
			var date = new Date();
			Event.date = date.getTime();
			Event.status = 1;
			enemy_arr.forEach(function (enemy) {
				if (enemy.behavior == 0 || enemy.behavior == 2) {
					enemy.img = imgs[6];
					b_Controller.set_fear.call(enemy);
				};
			});
			Sounds.signal.pause();
			Sounds.signal.currentTime = 0;

			Sounds.fear.play()
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
				if (enemy.id == 0) {
					enemy.img = imgs[2];
				};
				if (enemy.id == 1) {
					enemy.img = imgs[3];
				};
				if (enemy.id == 2) {
					enemy.img = imgs[4];
				};
				if (enemy.id == 3) {
					enemy.img = imgs[5];
				};
				b_Controller.set_passive.call(enemy);
			});
			Sounds.fear.pause()
			Sounds.fear.currentTime = 0;
			Sounds.signal.play();
			console.log("stop");
		},
		check_end: function () {
			var date = new Date();
			if (date.getTime() - Event.date > Event.duration) {
				Event.stop();
			};
		}
	}