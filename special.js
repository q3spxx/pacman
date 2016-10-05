var Special = {
	playerStop: function () {
		Player.mPos.x = 0
		Player.mPos.y = 0
	},
	playerGo: function () {
		switch (Player.curAction) {
			case 0:
				Player.left()
			break
			case 1:
				Player.up()
			break
			case 2:
				Player.right()
			break
			case 3:
				Player.down()
			break
		}
	},
	get_over_here: {
		level: 0,
		cooldown_handle: null,
		cooldown: 5,
		ready: true,
		handle: null,
		max_height: function () {
			return 64 + this.level * 52
		},
		start: function () {
			_data.status = "special";
			Player.mPos.x = 0;
			Player.mPos.y = 0;
			Sounds.get_over_here.play();

			var type;

			var img = {
				pic: Imgs.cord,
				x: 0,
				y: 0,
				w: 4,
				h: 4
			};

			var special_buf = new Special_buf(img, 4, 4);

			gl.special.push(special_buf);

			Special.get_over_here.handle = setInterval(function () {
				switch (Player.curAction) {
					case 0: this.w -= 4 
					break
					case 1: this.h -= 4
					break
					case 2: this.w += 4
					break
					case 3: this.h += 4
					break
				}

				var enemy = Col.special_check_enemy.call(this);

				if (enemy != false &&
					enemy.behavior != 'go_to_room' &&
					enemy.behavior != 'exit_from_room' &&
					enemy.behavior != 'enter_to_room' &&
					enemy.behavior != 'in_room'
					) {
					Special.get_over_here.stop();
					Sounds.scream.play()
					enemy.behavior = "grab";
					enemy.stop();
					enemy.path = [];
					Special.get_over_here.return_cord.call(this, enemy);
					return;
				};

				if (Col.special_check.call(this) || 
					Math.abs(this.w) > Special.get_over_here.max_height() ||
					Math.abs(this.h) > Special.get_over_here.max_height()) {
					Special.get_over_here.stop();
					Special.get_over_here.return_cord.call(this);
					return;
				};
			}.bind(special_buf), 1);


			Special.get_over_here.ready = false
			Special.get_over_here.cooldown_handle = setInterval(function () {
				if (Special.get_over_here.cooldown == 0) {
					Special.get_over_here.ready = true
					Special.get_over_here.cooldown = 5
					clearInterval(Special.get_over_here.cooldown_handle)
				} else {
					Special.get_over_here.cooldown -= 1
				}
			}, 1000)
		},
		return_cord: function (e) {
			var enemy = e;
			Special.get_over_here.handle = setInterval(function(){
				switch (Player.curAction) {
					case 0: this.w += 4
							if (enemy && enemy.behavior == 'grab') {enemy.pos.x += 4}
					break
					case 1: this.h += 4
							if (enemy && enemy.behavior == 'grab') {enemy.pos.y += 4}
					break
					case 2: this.w -= 4
							if (enemy && enemy.behavior == 'grab') {enemy.pos.x -= 4}
					break
					case 3: this.h -= 4
							if (enemy && enemy.behavior == 'grab') {enemy.pos.y -= 4}
					break
				}

				if (Player.curAction == 4) {
					if (enemy) {
						enemy.path[0] = {
							x: Math.floor(enemy.pos.x /32),
							y: Math.floor(enemy.pos.y /32)
						}
						b_Controller.set_passive.call(enemy)
					}
					Special.get_over_here.stop.call(this);
				}

				if (this.w == 4 && this.h == 4) {
					Special.get_over_here.stop.call(this);

					switch (Player.curAction) {
						case 0: Player.left();
						break
						case 1: Player.up();
						break
						case 2: Player.right();
						break
						case 3: Player.down();
						break
					}

					_data.status = "play";
				}

			}.bind(this), 1); 
		},
		stop: function () {
			clearInterval(Special.get_over_here.handle);
			for (var i = 0; i < gl.special.length; i++) {
				if (this.id == gl.special[i].id) {
					gl.special.splice(i, 1);
					break
				};
			};
		}
	},
	yo: {
		handle: null,
		date: null,
		status: false,
		start: function () {
			if (_data.status == 'ready' || _data.status == 'end game' || _data.status == 'shop') {
				return
			}
			Special.yo.status = true;
			var img = {
				pic: Imgs.yo,
				x: 0,
				y: 0,
				w: 110,
				h: 110
			}
			var event_buf = new Event_buf(img, 672, 672);
			gl.event.push(event_buf);

			Sounds.yo.play();

			Special.yo.handle = setInterval(function () {
				this.x -= 11;
				this.y -= 11;
				if (this.x == 562 && this.y == 562) {
					Special.yo.stop()
					Special.yo.waiting.call(this);
				};
			}.bind(event_buf), 10);
		},
		waiting: function () {
			_data.set_center_mess('press space')
			_data.center_mess_switch = true
			setTimeout(function () {
				_data.center_mess_switch = false
				Special.yo.stop()
				Special.yo.clean_up.call(this);
			}.bind(this), 600)
		},
		clean_up: function () {
			Special.yo.handle = setInterval(function () {
				this.x += 11;
				this.y += 11;
				if (this.x == 672 && this.y == 672) {
					Special.yo.stop()
					for (var i = 0; i < gl.event.length; i++) {
						if (this.id == gl.event[i].id) {
							gl.event.splice(i, 1);
							break
						};
					};
					Special.yo.status = false
					Event.set_random_event();
				};
			}.bind(this), 10);
		},
		stop: function () {
			clearInterval(Special.yo.handle);
		}
	},
	bomb: {
		level: 0,
		handle: null,
		cooldown_handle: null,
		cooldown: 30,
		radius: 0,
		ready: true,
		max_radius: function () {
			return 32 + 8 * this.level
		},
		start: function () {
			_data.status = "special";
			Player.mPos.x = 0;
			Player.mPos.y = 0;
			Special.bomb.handle = setInterval(function () {
				if (this.radius < this.max_radius()) {
					this.radius += 1;
					Col.bomb_check();
				} else {
					clearInterval(this.handle)
					setTimeout(function () {
						this.stop()
					}.bind(this), 300)
				}
			}.bind(this), 6)

			Special.bomb.ready = false;
			Special.bomb.cooldown_handle = setInterval(function () {
				if (Special.bomb.cooldown == 0) {
					Special.bomb.ready = true
					Special.bomb.cooldown = 30
					clearInterval(Special.bomb.cooldown_handle)
				} else {
					Special.bomb.cooldown -= 1
				}
			}, 1000)
		},
		stop: function () {
			_data.status = "play";
			switch (Player.curAction) {
				case 0: Player.left();
				break
				case 1: Player.up();
				break
				case 2: Player.right();
				break
				case 3: Player.down();
				break
			}
			this.radius = 0
		}
	},
	shot: {
		level: 1,
		ready: true,
		cooldown_handle: null,
		cooldown: 7,
		chanse: function () {
			return 10 * this.level
		},
		start: function () {
			Special.playerStop()
			_Tools.setTimeout(function () {
				Special.playerGo()
			}, 200)

			Sounds.shot.play()
			var buffer = new LowLayerBuffer(Imgs.fireOfShot, this.getParams, 200)
			gl.lowLayer.push(buffer)
			var enemy = Col.enemyInLine();

			if (enemy != false) {
				if (Col.missCheck()) {
					Effects.blood.add(enemy)
					Mess.setMess('headShot')
					Sounds.headshot.play()
					behaviorController.killEnemy(enemy)
				} else {
					Mess.setMess('miss', enemy.pos)
				}
			}
			return

			Special.shot.ready = false;
			Special.shot.cooldown_handle = setInterval(function () {
				if (Special.shot.cooldown == 0) {
					Special.shot.ready = true
					Special.shot.cooldown = 7
					clearInterval(Special.shot.cooldown_handle)
				} else {
					Special.shot.cooldown -= 1
				}
			}, 1000)

		},
		getParams: function () {

			switch (Player.curAction) {
				case 0:
					this.pic.x = 0
					this.pic.y = 0
					this.pic.w = 96
					this.pic.h = 32
					this.pos.x = Player.pos.x - 68
					this.pos.y = Player.pos.y
					this.pos.w = 96
					this.pos.h = 32
				break
				case 1:
					this.pic.x = 96
					this.pic.y = 0
					this.pic.w = 32
					this.pic.h = 96
					this.pos.x = Player.pos.x
					this.pos.y = Player.pos.y - 68
					this.pos.w = 32
					this.pos.h = 96
				break
				case 2:
					this.pic.x = 128
					this.pic.y = 0
					this.pic.w = 96
					this.pic.h = 32
					this.pos.x = Player.pos.x + 4
					this.pos.y = Player.pos.y
					this.pos.w = 96
					this.pos.h = 32
				break
				case 3:
					this.pic.x = 224
					this.pic.y = 0
					this.pic.w = 32
					this.pic.h = 96
					this.pos.x = Player.pos.x
					this.pos.y = Player.pos.y + 4
					this.pos.w = 32
					this.pos.h = 96
				break
			}
		}
	},
	shock: {
		ready: true,
		level: 0,
		handle: null,
		cooldown: 5,
		cooldown_handle: null,
		duration: 500,
		start: function () {
			_data.status = 'special'
			Player.stop()

			var shock = new Shock_buf(Imgs.shock, Player.pos.x, Player.pos.y, 32, 32)
			gl.shock.push(shock)

			this.handle = setInterval(function () {
				switch (Player.curAction) {
					case 0: this.x += -4
							this.y += 0
					break
					case 1: this.x += 0
							this.y += -4
					break
					case 2: this.x += 4
							this.y += 0
					break
					case 3: this.x += 0
							this.y += 4
					break
				}
				var enemy = Col.shock_enemy_check.call(this)
				if (enemy != false) {
					enemy.stop()
					enemy.shocked = true
					Anim.show_mess('Stun', {x: enemy.pos.x, y: enemy.pos.y}, 18, color['white'], 0);
					setTimeout(function () {
						this.shocked = false
					}.bind(enemy), Special.shock.duration  + 300 * Special.shock.level)
					Special.shock.stop.call(this)
					return
				}
				if (Col.shock_check.call(this)) {
					Special.shock.stop.call(this)
				}

			}.bind(shock), 2)

			Special.shock.ready = false;
			Special.shock.cooldown_handle = setInterval(function () {
				if (Special.shock.cooldown == 0) {
					Special.shock.ready = true
					Special.shock.cooldown = 5
					clearInterval(Special.shock.cooldown_handle)
				} else {
					Special.shock.cooldown -= 1
				}
			}, 1000)
		},
		stop: function () {
			clearInterval(Special.shock.handle)
			for (var i = 0; i < gl.shock.length; i++) {
				if (gl.shock[i].id == this.id) {
					gl.shock.splice(i, 1)
					break
				};
			}
			_data.status = 'play'
			switch (Player.curAction) {
				case 0: Player.left();
				break
				case 1: Player.up();
				break
				case 2: Player.right();
				break
				case 3: Player.down();
				break
			}
		}
	}
}