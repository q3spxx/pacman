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
	cord: {
		level: 10,
		distance: 0,
		status: 'notActive',
		enemy: false,
		emitter: false,
		bloodLine: {
			x: 0,
			y: 0
		},
		cooldownHandle: null,
		cooldown: 5,
		ready: true,
		handle: null,
		maxDistance: function () {
			return this.level * 64
		},
		start: function () {
			_Data.status = "special";
			Player.mPos.x = 0;
			Player.mPos.y = 0;
			Sounds.getOverHere.play();

			this.status = 'runned'

			var buffer = new LowLayerBuffer(Imgs.cord, this.getParams, 10000)
			gl.lowLayer.push(buffer)
			return
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
		getParams: function () {

			var pic = {
				x: 0,
				y: 0,
				pos: {
					x: Player.pos.x + 14,
					y: Player.pos.y + 14
				}
			}

			if (Special.cord.status == 'runned') {
				Special.cord.distance += 30
			} else if (Special.cord.status == 'return') {
				Special.cord.distance -= 30
			}

			switch (Player.curAction) {
				case 0:
					pic.w = Special.cord.distance
					pic.h = 4
					pic.pos.w = Special.cord.distance * -1
					pic.pos.h = 4
				break
				case 1:
					pic.w = 4
					pic.h = Special.cord.distance
					pic.pos.w = 4
					pic.pos.h = Special.cord.distance * -1
				break
				case 2:
					pic.w = Special.cord.distance
					pic.h = 4
					pic.pos.w = Special.cord.distance
					pic.pos.h = 4
				break
				case 3:
					pic.w = 4
					pic.h = Special.cord.distance
					pic.pos.w = 4
					pic.pos.h = Special.cord.distance
				break
			}
			if (Math.abs(pic.pos.w) > Special.cord.maxDistance() ||
				Math.abs(pic.pos.h) > Special.cord.maxDistance()) {
				Special.cord.status = 'return'
				return
			}
			if (pic.pos.x + pic.pos.w >= 672 ||
				pic.pos.x + pic.pos.w < 0 ||
				_Map.grid[Math.floor((pic.pos.x + pic.pos.w) / 32)]
						 [Math.floor((pic.pos.y + pic.pos.h) / 32)].object.block) {
				Special.cord.status = 'return'
				switch (Player.curAction) {
					case 0:
						pic.pos.w = (Math.floor((pic.pos.x + pic.pos.w)  / 32) * 32) - pic.pos.x + 32
					break
					case 1:
						pic.pos.h = (Math.floor((pic.pos.y + pic.pos.h)  / 32) * 32) - pic.pos.y + 32
					break
					case 2:
						pic.pos.w = (Math.floor((pic.pos.x + pic.pos.w)  / 32) * 32) - pic.pos.x
					break
					case 3:
						pic.pos.h = (Math.floor((pic.pos.y + pic.pos.h)  / 32) * 32) - pic.pos.y
					break
				}
			}

			if (Special.cord.enemy) {
				Special.cord.emitter.pos.x = pic.pos.x + pic.pos.w
				Special.cord.emitter.pos.y = pic.pos.y + pic.pos.h
				switch (Player.curAction) {
					case 0:
						Special.cord.enemy.pos.x = pic.pos.x + pic.pos.w - 	16				
						Special.cord.enemy.pos.y = pic.pos.y -  14				
					break
					case 1:
						Special.cord.enemy.pos.x = pic.pos.x -  14				
						Special.cord.enemy.pos.y = pic.pos.y + pic.pos.h - 	16				
					break
					case 2:
						Special.cord.enemy.pos.x = pic.pos.x + pic.pos.w + 	16				
						Special.cord.enemy.pos.y = pic.pos.y -  14				
					break
					case 3:
						Special.cord.enemy.pos.x = pic.pos.x -  14				
						Special.cord.enemy.pos.y = pic.pos.y + pic.pos.h + 	16				
					break
				}

			}

			if (Special.cord.distance <= 0) {
				Special.cord.distance = 0
				Special.cord.status = "notActive"
				this.removeBuffer()
				if (Special.cord.enemy) {
					behaviorController.killEnemy(Special.cord.enemy)
					Special.cord.enemy = false
					Special.cord.emitter.remove()
					Special.cord.emitter = false
				}
				_Data.status = 'isRunned'
			}

			if (Special.cord.status == 'runned') {
				for (var i = 0; i < enemyArr.length; i++) {
					if (
						pic.pos.x + pic.pos.w + 2 > enemyArr[i].pos.x &&
						pic.pos.x + pic.pos.w + 2 < enemyArr[i].pos.x + 32 &&
						pic.pos.y + pic.pos.h + 2 > enemyArr[i].pos.y &&
						pic.pos.y + pic.pos.h + 2 < enemyArr[i].pos.y + 32
						) {
						if (enemyArr[i].behavior == 'goToRoom') {
							continue
						}
						Special.cord.enemy = enemyArr[i]
						Special.cord.enemy.path = []
						Special.cord.enemy.mPos.x = 0
						Special.cord.enemy.mPos.y = 0
						behaviorController.setIsBusted.call(Special.cord.enemy)
						Special.cord.status = 'return'


						switch (Player.curAction) {
							case 0:
								pic.pos.w = Special.cord.enemy.pos.x - pic.pos.x + 16
							break
							case 1:
								pic.pos.h = Special.cord.enemy.pos.y - pic.pos.y + 16
							break
							case 2:
								pic.pos.w = pic.pos.x - Special.cord.enemy.pos.x + 16
							break
							case 3:
								pic.pos.h = pic.pos.y - Special.cord.enemy.pos.y + 16
							break
						}
						Special.cord.emitter = Effects.emitter.add(Imgs.blood, pic.pos.x + pic.pos.w, pic.pos.y + pic.pos.h, 16, 8, 50, 20, Effects.emitter.lib.line)
						Special.cord.bloodLine.x = Special.cord.enemy.pos.x
						Special.cord.bloodLine.y = Special.cord.enemy.pos.y
						var lowLayer = new LowLayerBuffer(Imgs.bloodLine, function () {
							if (!Special.cord.enemy) {
								return
							}
							var bloodLine = {
								pos: {}
							}
							bloodLine.y = 0
							bloodLine.pos.x = Special.cord.bloodLine.x
							bloodLine.pos.y = Special.cord.bloodLine.y
							bloodLine.pos.w = Special.cord.enemy.pos.x - Special.cord.bloodLine.x + 32
							bloodLine.pos.h = Special.cord.enemy.pos.y - Special.cord.bloodLine.y + 64
							switch (Player.curAction) {
								case 0:
									bloodLine.x = 0
									bloodLine.w = 96
									bloodLine.h = 32

								break
								case 1:
									bloodLine.x = 96
									bloodLine.w = 32
									bloodLine.h = 96
								break
								case 2:
									bloodLine.x = 128
									bloodLine.w = 96
									bloodLine.h = 32
								break
								case 3:
									bloodLine.x = 160
									bloodLine.w = 32
									bloodLine.h = 96
								break
							}
						this.picArr = []
						this.picArr.push(bloodLine)
						}, 10000)
						gl.lowLayer.push(lowLayer)
						break
					}
				}
			}

			this.picArr = []
			this.picArr.push(pic)

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
		level: 10,
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

			this.picArr = []
			var pic = {
				pos: {}
			}

			switch (Player.curAction) {
				case 0:
					pic.x = 0
					pic.y = 0
					pic.w = 96
					pic.h = 32
					pic.pos.x = Player.pos.x - 68
					pic.pos.y = Player.pos.y
					pic.pos.w = 96
					pic.pos.h = 32
				break
				case 1:
					pic.x = 96
					pic.y = 0
					pic.w = 32
					pic.h = 96
					pic.pos.x = Player.pos.x
					pic.pos.y = Player.pos.y - 68
					pic.pos.w = 32
					pic.pos.h = 96
				break
				case 2:
					pic.x = 128
					pic.y = 0
					pic.w = 96
					pic.h = 32
					pic.pos.x = Player.pos.x + 4
					pic.pos.y = Player.pos.y
					pic.pos.w = 96
					pic.pos.h = 32
				break
				case 3:
					pic.x = 224
					pic.y = 0
					pic.w = 32
					pic.h = 96
					pic.pos.x = Player.pos.x
					pic.pos.y = Player.pos.y + 4
					pic.pos.w = 32
					pic.pos.h = 96
				break
			}
			this.picArr.push(pic)
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