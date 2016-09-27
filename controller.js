var Controller = {
		start: function () {
			this.handle = _Tools.setInterval(function () {

				if (this.id != 4) {
					switch (this.behavior) {
						case 'chase': ai.searchPath.call(this)
						break
						case 'fear': ai.fear.call(this)
						break
						case "fearPreTimeout": ai.fear.call(this)
						break
						case 'passive': ai.passive.call(this)
						break
						case 'waiting': 
						break
						case 'grab':
						break
						case 'free': ai.free.call(this)
						break
						case 'goToRoom': ai.free.call(this)
						break
						case "enterToRoom": ai.searchPath.call(this)
						break
						case "inRoom": ai.searchPath.call(this)
						break
						case 'exitFromRoom': ai.searchPath.call(this)
						break
					}
					Move.aiDirection.call(this);
				} else {
					ai.playerPos.x = Math.floor((this.pos.x) / 32);
					ai.playerPos.y = Math.floor((this.pos.y) / 32);
				};

		 		Move.set.call(this);
			}.bind(this), this.speed - _Data.gameSpeed);
		},
		stop: function () {
			_Tools.clearInterval(this.handle);
		}
	};

	var behaviorController = {
		checkVisibility: function () {
			var pos = {
				x: Math.floor((this.pos.x + 16) / 32),
				y: Math.floor((this.pos.y + 16) / 32)
			};
			if (pos.x == ai.playerPos.x) {
				var distance = Math.abs(pos.y - ai.playerPos.y)
				if (Math.abs(pos.y + this.mPos.y - ai.playerPos.y) >= distance) {
					return false
				}
				while (pos.y != ai.playerPos.y) {
					if (_Map.grid[pos.x][pos.y].object.block) {
						return false
					};
					pos.y += this.mPos.y
				}
				return true
			}
			if (pos.y == ai.playerPos.y) {
				var distance = Math.abs(pos.x - ai.playerPos.x)
				if (Math.abs(pos.x + this.mPos.x - ai.playerPos.x) >= distance) {
					return false
				}
				while (pos.x != ai.playerPos.x) {
					if (_Map.grid[pos.x][pos.y].object.block) {
						return false
					};
					pos.x += this.mPos.x
					if (pos.x < 0) {
						pos.x = 20
					} else if (pos.x > 20) {
						pos.x = 0
					};
				}
				return true
			};

			return false
		},
		setChase: function () {
			this.behavior = "chase";
			this.pointPos = ai.playerPos;
		},
		setFear: function () {
			this.behavior = "fear";
		},
		setFearPreTimeout: function () {
			this.behavior = "fearPreTimeout"
		},
		setPassive: function () {
			this.behavior = "passive";
		},
		setWaiting: function () {
			this.behavior = "waiting";
		},
		setFree: function (point) {
			this.point_pos = point;
			this.behavior = "free";
		},
		setGoToRoom: function () {
			this.behavior = "goToRoom"
		},
		setEnterToRoom: function () {
			this.behavior = "enterToRoom"
		},
		setInRoom: function () {
			this.behavior = "inRoom"
		},
		setExitFromRoom: function () {
			this.behavior = 'exitFromRoom';
		},
		killEnemy: function (enemy) {
			enemy.goToRoom()
			var points = 100 * Math.pow(2, Kill.getGain())
			_Data.addPoints(points)
			Mess.setMess(points, enemy.pos)
			Kill.activate()

			/*

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
			enemy.go_to_room();*/
		}
	};

	var Events = {
		energiser: {
			activated: false,
			duration: 10,
			timeToEnd: 0,
			handle: null,
			timer: false,
			timerHandle: null,
			timerDelay: 5,
			timeToStart: 0,
			setTimer: function () {
				this.timeToStart = this.timerDelay
				this.timer = true
				this.timerHandle = _Tools.setInterval(function () {
					this.timeToStart--
					if (this.timeToStart == 0) {
						this.removeTimer()
						this.activate()
					}
				}.bind(this), 1000)
			},
			removeTimer: function () {
				_Tools.clearInterval(this.timerHandle)
				this.timer = false
			},
			deactivate: function () {
				_Tools.clearInterval(this.handle)
				this.activated = false
			},
			activate: function () {

				if (this.activated) {
					this.deactivate()
				}

				this.activated = true
				this.timeToEnd = this.duration

				enemyArr.forEach(function (enemy) {
					if (
						enemy.behavior == "passive" ||
						enemy.behavior == "chase" ||
						enemy.behavior == "fear" ||
						enemy.behavior == "fearPreTimeout"
						) {
						behaviorController.setFear.call(enemy)
					}
				})

				this.handle = _Tools.setInterval(function () {
					if (this.timeToEnd == 0) {
						this.deactivate()
						enemyArr.forEach(function (enemy) {
							if (enemy.behavior == "fearPreTimeout") {
								behaviorController.setPassive.call(enemy)
							}
						})
					} else if (this.timeToEnd == Math.floor(this.duration * 0.3)) {
						enemyArr.forEach(function (enemy) {
							if (enemy.behavior == "fear") {
								behaviorController.setFearPreTimeout.call(enemy)
							}
						})
					}
					this.timeToEnd--
				}.bind(this), 1000)
			}
		},
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
			this.buf_event = false
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
				console.log("buf_event")
				Event.buf_event_start()
			}, 6000)
			this.buf_event = true
		},
		buf_event_start: function () {
			console.log("event start")
			var random = Math.round(Math.random() * (this.buf_events.length - 1))
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
			console.log("event stop")
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
					enemy.behavior == "enterToRoom" || 
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