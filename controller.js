var Controller = {
		start: function () {
			this.handle = setInterval(function () {

				if (this.id != 4) {
					switch (this.behavior) {
						case 'chase': ai.search_path.call(this)
						break
						case 'fear': ai.fear.call(this)
						break
						case 'passive': ai.passive.call(this)
						break
						case 'waiting': 
						break
						case 'grab':
						break
						case 'free': ai.free.call(this)
						break
						case 'go_to_room': ai.free.call(this)
						break
						case "enter_to_room": ai.free.call(this)
						break
						case "in_room": ai.free.call(this)
						break
						case 'exit_from_room': ai.free.call(this)
						break
					}
					Move.ai_arrows.call(this);
				} else {
					ai.player_pos.x = Math.floor((this.pos.x) / 32);
					ai.player_pos.y = Math.floor((this.pos.y) / 32);
				};

		 		Move.set.call(this);
			}.bind(this), this.speed);
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
			Controller.start.call(Player)
		},
		kill_enemy: function (enemy) {
			if (
				enemy.behavior == 'go_to_room' ||
				enemy.behavior == 'enter_to_room' ||
				enemy.behavior == 'exit_from_room' ||
				enemy.behavior == 'in_room'
				) {
				return
			}

			enemy.path = [];
			enemy.path[0] = {
				x: Math.floor(enemy.pos.x /32),
				y: Math.floor(enemy.pos.y /32)
			}

			if (enemy.behavior == 'grab') {
				Sounds.bones.play()
			}

			Sounds.eatghost.play()
			if (_data.firstblood) {
				_data.firstblood = false;
				setTimeout(function () {
					_data.change_sound(audio_mess)
					Sounds.show_mess("First blood!") 
					Sounds.firstblood.play()
				}, 1000);
			};

			_data.kills += 1;

			if (_data.kill) {
				var say = false;
				var mess = Sounds.mess

				switch (_data.kills) {
					case 2: say = Sounds.doublekill
							mess = "Double kill!"
					break
					case 3: say = Sounds.multikill
							mess = "Multi kill!"
					break
					case 4: say = Sounds.megakill
							mess = "Mega kill!"
					break
				}
				if (say != false) {						
					setTimeout(function () {
						_data.change_sound(audio_mess)
						Sounds.show_mess(mess)
						say.play()
					}, 200);
				};
			};

			_data.kill_timer();

			Anim.show_mess(Math.pow(2, _data.kills) * 100, {x: enemy.pos.x, y: enemy.pos.y}, 18, color['white'], 0);
			Scope.main += Math.pow(2, _data.kills) * 100;
			enemy.go_to_room();
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
			this.behavior = "chase";
			this.point_pos = ai.player_pos;
		},
		set_fear: function () {
			this.behavior = "fear";
		},
		set_passive: function () {
			this.behavior = "passive";
		},
		set_waiting: function () {
			this.behavior = "waiting";
		},
		set_free: function (point) {
			this.point_pos = point;
			this.behavior = "free";
		},
		set_go_to_room: function () {
			this.behavior = "go_to_room"
		},
		set_enter_to_room: function () {
			this.behavior = "enter_to_room"
		},
		set_in_room: function () {
			this.behavior = "in_room"
		},
		set_exit_from_room: function () {
			this.behavior = 'exit_from_room';
		}
	};

	var Event = {
		status: false,
		update: 0,
		duration: 10000,
		timeout: false,
		set_random_event: function () {
			setTimeout(function () {
				if (_data.status == "play") {
					Special.yo.start();
				}
			}, Math.random() * 180000);
		},
		start: function () {
			if (Event.status) {
				Event.update += 1;
			};

			Event.status = true;

			enemy_arr.forEach(function (enemy) {
				if (enemy.behavior == "passive" || enemy.behavior == "chase" || enemy.behavior == "fear") {
					enemy.set_fear_img();
					b_Controller.set_fear.call(enemy);
				};
			});
			Sounds.signal.pause();
			Sounds.signal.currentTime = 0;

			if (!Sounds.fear.paused) {
				Sounds.fear.pause();
				Sounds.fear.currentTime = 0
			};

			Event.timeout = false

			setTimeout(function () {
				Sounds.fear.play()
			}, 5)
			setTimeout(function () {
				if (Event.update == 0) {
					enemy_arr.forEach(function (enemy) {
						if (enemy.behavior == "fear") {
							Event.timeout = true;
							enemy.set_fear_pre_timeout_img()
						};
					});
				}
			}, Event.duration * 0.7);
			setTimeout(function () {
				if (Event.update == 0) {
					Event.stop();
				} else {
					Event.update -= 1;
				};
			}, Event.duration)
			console.log("start");
		},
		stop: function () {
			Event.status = false;
			enemy_arr.forEach(function (enemy) {
				if (
					enemy.behavior == "in_room" || 
					enemy.behavior == "enter_to_room" || 
					enemy.behavior == "exit_from_room" || 
					enemy.behavior == "go_to_room" 
					) {
					return
				}
				enemy.set_original_img()
				b_Controller.set_passive.call(enemy);
			});
			Sounds.fear.pause()
			Sounds.fear.currentTime = 0;
			Sounds.signal.play();
			console.log("stop");
		}
	}