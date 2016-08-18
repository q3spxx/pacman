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
				enemy.pos.x = Math.floor(enemy.pos.x / 32) * 32
				enemy.pos.y = Math.floor(enemy.pos.y / 32) * 32
				Sounds.bones.play()
			}
			if (enemy.shocked) {
				enemy.shocked = false
			}
			Sounds.eatghost.play()
			if (_data.firstblood) {
				_data.firstblood = false;
				setTimeout(function () {
					_data.change_sound(audio_mess)
					Sounds.show_mess("First blood!") 
					Sounds.firstblood.play()
				}, 1200);
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

			_data.total_kills += 1

			var total_say = false
			var total_mess = Sounds.mess
			switch(_data.total_kills) {
				case 3: total_say = Sounds.killingspree
						total_mess = 'Killing spree!'
				break
				case 6: total_say = Sounds.rampage
						total_mess = 'Rampage!'
				break
				case 9: total_say = Sounds.dominating
						total_mess = 'Dominating!'
				break
				case 12: total_say = Sounds.unstoppable
						total_mess = 'Unstoppable!'
				break
				case 15: total_say = Sounds.godlike
						total_mess = 'Godlike!'
				break
			}

			if (total_say != false) {
				setTimeout(function () {
					_data.change_sound(audio_mess)
					Sounds.show_mess(total_mess)
					total_say.play()
				}, 1000)
			};

			_data.kill_timer();

			var points = Math.pow(2, _data.kills) * 100
			if (Event.buf_event_active) {
				points = points * Event.buf_event_action;
			}

			Anim.show_mess(points, {x: enemy.pos.x, y: enemy.pos.y}, 18, color['white'], 0);
			Scope.main += points;
			enemy.go_to_room();
		}
	};

	var b_Controller = {
		check_visibility: function () {
			var pos = {
				x: Math.floor(this.pos.x / 32),
				y: Math.floor(this.pos.y / 32)
			};

			while (pos.x != Math.floor((ai.player_pos.x + 16) / 32) && pos.y != Math.floor((ai.player_pos.y + 16) / 32)) {
				if (_Map.grid[pos.x][pos.y].block) {
					return false;
				};
				pos.x += this.m_pos.x;
				pos.y += this.m_pos.y;
				if (pos.x < 0) {
					pos.x = 20
				} else if (pos.x > 20) {
					pos.x = 0
				};
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
		duration: 5000,
		timeout: false,
		random_event: false,
		random_event_handle: null,
		buf_event: false,
		buf_event_pos: {x:0, y:0},
		buf_event_duration: 10,
		buf_event_handle: null,
		buf_event_timer_handle: null,
		buf_events: [{name: 'x2', action: 2},{name:'x3', action: 3}],
		buf_event_action: 1,
		buf_event_text: '',
		buf_event_active: false,
		buf_event_active_handle: null,
		buf_event_default: function () {
			this.buf_event_active = false
			this.buf_event_action = 1
			this.buf_event_text = ''
			gl.buf_event = []
		},
		buf_event_taked: function () {
			clearInterval(this.buf_event_timer_handle)
			gl.buf_event = []
			this.buf_event = false
			this.buf_event_active = true

			this.buf_event_active_handle = setTimeout(function () {
				this.buf_event_default()
				this.set_buf_event()
			}.bind(this), 10000)

		},
		set_buf_event: function () {
			this.buf_event_handle = setTimeout(function () {
				Event.buf_event_start()
			}, 6000)
		},
		buf_event_start: function () {
			var random = Math.round(Math.random() * (this.buf_events.length - 1))
			this.buf_event = true
			Event.buf_event_duration = 10
			var empty = _Map.event_graph.filter(function (cell) {
				if (cell.type == 'e') {
					return true
				}
				return false
			})
			var random_cell = Math.floor(Math.random() * (empty.length - 1))
			this.buf_event_pos.x = (empty[random_cell].x * 32) + 16
			this.buf_event_pos.y = (empty[random_cell].y * 32) + 16
			Event_blocks[this.buf_events[random].name].pos.x = empty[random_cell].x * 32
			Event_blocks[this.buf_events[random].name].pos.y = empty[random_cell].y * 32
			this.buf_event_action = this.buf_events[random].action
			this.buf_event_text = this.buf_events[random].name
			gl.buf_event.push(Event_blocks[this.buf_events[random].name])
			this.buf_event_timer_handle = setInterval(function () {
				Event.buf_event_duration -= 1
				if (Event.buf_event_duration == 0) {
					Event.buf_event_stop()
				};
			}, 1000)
		},
		buf_event_stop: function () {
			clearInterval(Event.buf_event_timer_handle)
			gl.buf_event = []
			this.buf_event = false
			this.set_buf_event()
		},
		set_random_event: function () {
			Event.random_event_handle = setTimeout(function () {
				if (_data.status == "play") {
					Special.yo.start();
				}
			}, Math.floor(Math.random() * 180000));
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
				if (Event.update <= 0 && Event.status) {
					Event.stop();
				} else {
					Event.update -= 1;
				};
			}, Event.duration)
			console.log("start");
		},
		stop: function () {
			Event.status = false;
			Event.update = 0;
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
			if (!Sounds.fear.paused) {
				Sounds.fear.pause()
				Sounds.fear.currentTime = 0;
			}
			if (_data.status == 'play') {
				Sounds.signal.play();
			}
			console.log("stop");
		}
	}