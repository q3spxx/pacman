var Special = {
	playerStop: function () {
		_Data.status = 'special'
		Player.mPos.x = 0
		Player.mPos.y = 0
	},
	playerGo: function () {
		_Data.status = 'isRunned'
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
		level: 5,
		distance: 0,
		status: 'notActive',
		enemy: false,
		emitter: false,
		speed: 5,
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

			var buffer = new LowLayerBuffer(Imgs.cord, this.getParams, this.speed, 1, 10000)
			gl.lowLayer.push(buffer)
			return
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
				Special.cord.distance += 4
			} else if (Special.cord.status == 'return') {
				Special.cord.distance -= 4
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
					Sounds.bones.play()
					behaviorController.killEnemy(Special.cord.enemy)
					Effects.emitter.add(Imgs.blood, Special.cord.enemy.pos.x + 16, Special.cord.enemy.pos.y + 16, 64, 8, 50, 16, 'line', 300)
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
						if (
							enemyArr[i].behavior == 'goToRoom' ||
							enemyArr[i].behavior == 'inRoom' ||
							enemyArr[i].behavior == 'enterToRoom' ||
							enemyArr[i].behavior == 'exitFromRoom'
							) {
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
						Special.cord.emitter = Effects.emitter.add(Imgs.blood, pic.pos.x + pic.pos.w, pic.pos.y + pic.pos.h, 128, 32, 50, 16, 'line')
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
							switch (Player.curAction) {
								case 0:
									bloodLine.pos.x = Special.cord.bloodLine.x
									bloodLine.pos.y = Special.cord.bloodLine.y
									bloodLine.pos.w = Special.cord.enemy.pos.x - Special.cord.bloodLine.x
									bloodLine.pos.h = 32
									bloodLine.x = 0
									bloodLine.w = 96
									bloodLine.h = 32

								break
								case 1:
									bloodLine.pos.x = Special.cord.bloodLine.x
									bloodLine.pos.y = Special.cord.bloodLine.y
									bloodLine.pos.w = 32
									bloodLine.pos.h = Special.cord.enemy.pos.y - Special.cord.bloodLine.y
									bloodLine.x = 96
									bloodLine.w = 32
									bloodLine.h = 96
								break
								case 2:
									bloodLine.pos.x = Special.cord.bloodLine.x + 32
									bloodLine.pos.y = Special.cord.bloodLine.y
									bloodLine.pos.w = Special.cord.enemy.pos.x - Special.cord.bloodLine.x - 32
									bloodLine.pos.h = 32
									bloodLine.x = 128
									bloodLine.w = 96
									bloodLine.h = 32
								break
								case 3:
									bloodLine.pos.x = Special.cord.bloodLine.x
									bloodLine.pos.y = Special.cord.bloodLine.y + 32
									bloodLine.pos.w = 32
									bloodLine.pos.h = Special.cord.enemy.pos.y - Special.cord.bloodLine.y - 32
									bloodLine.x = 224
									bloodLine.w = 32
									bloodLine.h = 96
								break
							}
						this.picArr = []
						this.picArr.push(bloodLine)
						}, Special.cord.speed, 1, 10000)
						gl.lowLayer.push(lowLayer)
						break
					}
				}
			}

			this.picArr = []
			this.picArr.push(pic)
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
		ready: true,
		level: 10,
		emitter: false,
		handle: null,
		cooldown_handle: null,
		cooldown: 30,
		radius: 0,
		getRadius: function () {
			return 32 + 8 * this.level
		},
		start: function () {
			_Data.status = "special";
			Special.playerStop()
			var lowLayer = new LowLayerBuffer(Imgs.bomb, this.getParams, 40, 1, 1000)
			gl.lowLayer.push(lowLayer)
			this.emitter = Effects.emitter.add(Imgs.shockPartical, Player.pos.x + 16, Player.pos.y + 16, this.getRadius(), 24, 100, 16, 'line', 400)
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
		},
		getParams: function () {
			Special.bomb.radius += Special.bomb.getRadius() / 10
			if (Special.bomb.radius >= Special.bomb.getRadius()) {
				this.removeBuffer()
				Special.bomb.radius = 0
				Special.bomb.emitter.remove()
				Special.bomb.emitter = false
				Special.playerGo()
			}

			var pic = {
				x: 0,
				y: 0,
				w: 56,
				h: 56,
				pos: {
					x: Player.pos.x + 16 - Special.bomb.radius,
					y: Player.pos.y + 16 - Special.bomb.radius,
					w: Special.bomb.radius * 2,
					h: Special.bomb.radius * 2
				}

			}

			enemyArr.forEach(function (enemy) {
				if (
					enemy.behavior == "goToRoom" ||
					enemy.behavior == "inRoom" ||
					enemy.behavior == "enterToRoom" ||
					enemy.behavior == "exitFromRoom"
					) {
					return
				}
				if (Col.hypotenuse(Player.pos.x + 16, Player.pos.y + 16, enemy.pos.x + 16, enemy.pos.y + 16, Special.bomb.radius)) {
					Effects.emitter.add(Imgs.blood, enemy.pos.x + 16, enemy.pos.y + 16, 64, 8, 50, 16, 'line', 300)
					behaviorController.killEnemy(enemy)
				}
			})

			this.picArr = []
			this.picArr.push(pic)
		}
	},
	shot: {
		level: 10,
		ready: true,
		emitter: false,
		speed: 5,
		cooldown_handle: null,
		cooldown: 7,
		chanse: function () {
			return 10 * this.level
		},
		start: function () {
			Special.playerStop()
			_Tools.setTimeout(function () {
				Special.playerGo()
			}, 100)

			Sounds.shot.play()
			var buffer = new LowLayerBuffer(Imgs.fireOfShot, this.getParams, this.speed, 1, 100)
			gl.lowLayer.push(buffer)
			var enemy = Col.enemyInLine();

			if (enemy != false) {
				if (Col.missCheck()) {
					this.emitter = Effects.emitter.add(Imgs.blood, enemy.pos.x + 16, enemy.pos.y + 16, 64, 8, 50, 16, 'line', 300)
					Effects.blood.add(enemy)
					Mess.setMess('headShot')
					Sounds.headshot.play()
					behaviorController.killEnemy(enemy)
				} else {
					Mess.setMess('miss', enemy.pos)
				}
			}
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
		level: 10,
		distance: 0,
		duration: 5000,
		emitter: false,
		speed: 7,
		enemy: false,
		handle: null,
		cooldown: 5,
		cooldown_handle: null,
		start: function () {
			Special.playerStop()
			var lowLayer = new LowLayerBuffer(Imgs.shock, this.getParams, this.speed, 1, 10000)
			gl.lowLayer.push(lowLayer)
		},
		getParams: function () {
			var pic = {
				x: 0,
				y: 0,
				w: 32,
				h: 32,
				pos: {
					w: 32,
					h: 32
				}
			}

			switch (Player.curAction) {
				case 0:
					pic.pos.x = Player.pos.x - Special.shock.distance
					pic.pos.y = Player.pos.y
				break
				case 1:
					pic.pos.x = Player.pos.x
					pic.pos.y = Player.pos.y - Special.shock.distance
				break
				case 2:
					pic.pos.x = Player.pos.x + Special.shock.distance + 32
					pic.pos.y = Player.pos.y
				break
				case 3:
					pic.pos.x = Player.pos.x
					pic.pos.y = Player.pos.y + Special.shock.distance + 32
				break
			}
			if (!this.emitter) {
				this.emitter = Effects.emitter.add(Imgs.shockPartical, pic.pos.x + 16, pic.pos.y + 16, 64, 4, 50, 16, 'line')
			} else {
				this.emitter.pos.x = pic.pos.x + 16
				this.emitter.pos.y = pic.pos.y + 16
			};

			if (_Map.grid[Math.floor(pic.pos.x / 32)][Math.floor(pic.pos.y / 32)].object.block ||
				_Map.grid[Math.floor((pic.pos.x + 31) / 32)][Math.floor((pic.pos.y + 31) / 32)].object.block) {
				Special.playerGo()
				Special.shock.distance = 0
				this.removeBuffer()
				this.emitter.remove()
				Special.shock.emitter = false
			}
			var enemy = Col.checkEnemy.call(pic)
			if (enemy) {

				Special.playerGo()
				Special.shock.distance = 0
				this.removeBuffer()
				this.emitter.remove()
				Special.shock.emitter = false

				if (Special.shock.enemy) {
					return
				}
				Special.shock.enemy = true

				behaviorController.setShocked.call(enemy)
				var highLayer = new HighLayerBuffer(Imgs.shocked, function () {
					var pic = {
						y: 0,
						w: 32,
						h: 32,
						pos: {
							x: enemy.pos.x,
							y: enemy.pos.y,
							w: 32,
							h: 32
						}
					}
					pic.x = this.curFrame * 32
					this.curFrame++
					if (this.tFrames <= this.curFrame) {
						this.curFrame = 0
					}
					this.picArr = []
					this.picArr.push(pic)
				}, 200, 2, Math.floor(Special.shock.duration * Special.shock.level / 10))
				gl.highLayer.push(highLayer)
				Special.shock.handle = _Tools.setTimeout.call(enemy, function () {
					behaviorController.setPassive.call(this)
					Special.shock.enemy = false
					highLayer.removeBuffer()
				}, Math.floor(Special.shock.duration * Special.shock.level / 10))
			}

			this.picArr = []
			this.picArr.push(pic)

			Special.shock.distance += 4
		}
	}
}