function cooldownEnable () {

	this.ready = false
	this.timer = this.cooldown
	this.cooldownHandle = _Tools.setInterval.call(this, function () {
		this.timer--
		if (this.timer == 0) {
			this.cooldownDisable()
		}
	}, 1000)
}
function cooldownDisable () {
	this.ready = true
	this.timer = 0
	_Tools.clearInterval(this.cooldownHandle)
}

var Special = {
	setAllDefault: function () {
		Special.shock.setDefault()
		Special.shot.setDefault()
		Special.bomb.setDefault()
		Special.cord.setDefault()
	},
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
		__proto__: {
			cooldownEnable: cooldownEnable,
			cooldownDisable: cooldownDisable
		},
		timer: 0,
		level: 0,
		lLB: false,
		state: 0,
		distance: 0,
		direction: 0,
		interval: false,
		status: 'notActive',
		isFeared: false,
		enemy: false,
		emitter: false,
		speed: 5,
		bloodLine: {
			lowLayerBuffer: false,
			x: 0,
			y: 0
		},
		cooldownHandle: null,
		cooldown: 5,
		ready: true,
		x: 0,
		y: 0,
		vec: {
			x: 1,
			y: 1
		},
		setDefault: function () {
			this.cooldownDisable()
			this.reset(0)
			this.reset(1)
		},
		maxDistance: function () {
			return this.level * 64
		},
		reset: function (state) {
			switch (state) {
				case 0:
					if (this.lLB) {
						this.lLB.removeBuffer()
						this.lLB = false
					}
					if (this.interval) {
						_Tools.clearInterval(this.interval)
						this.interval = false
					}
					this.distance = 0
					this.state = 0
				break
				case 1:
					this.enemy = false
					this.isFeared = false
				break
				case 2:
					if (this.emitter) {
						this.emitter.remove()
						this.emitter = false
					}
				break
			}
		},
		start: function () {
			//init
			Special.playerStop()
			Sounds.getOverHere.play();
			this.direction = Player.curAction
			switch (this.direction) {
				case 0:
					this.vec.x = -1
					this.vec.y = 0
				break
				case 1:
					this.vec.x = 0
					this.vec.y = -1
				break
				case 2:
					this.vec.x = 1
					this.vec.y = 0
				break
				case 3:
					this.vec.x = 0
					this.vec.y = 1
				break
			}
			this.x = Player.pos.x + 16
			this.y = Player.pos.y + 16
			//set interval
			this.interval = _Tools.setInterval.call(this, function () {
				//set distance
				switch (this.state) {
					case 0:
						this.distance += 4
					break
					case 1:
						this.distance -= 4
					break
				}
				//move enemy
				if (this.enemy) {
					this.enemy.pos.x = this.x + this.distance * this.vec.x - 16
					this.enemy.pos.y = this.y + this.distance * this.vec.y - 16
				}
				//return if more max distance
				if (Math.abs(this.distance) > Special.cord.maxDistance()) {
					this.state = 1
					return
				}
				//check collision
				if (this.x + this.distance * this.vec.x >= 672 ||
					this.x + this.distance * this.vec.x < 0 ||
					_Map.grid[Math.floor((this.x + this.distance * this.vec.x) / 32)]
							 [Math.floor((this.y + this.distance * this.vec.y) / 32)].object.block) {
					this.state = 1
					return
				}
				//check enemy
				if (this.state == 0) {
					for (var i = 0; i < enemyArr.length; i++) {
						if (
							this.x + this.distance * this.vec.x > enemyArr[i].pos.x &&
							this.x + this.distance * this.vec.x < enemyArr[i].pos.x + 32 &&
							this.y + this.distance * this.vec.y > enemyArr[i].pos.y &&
							this.y + this.distance * this.vec.y < enemyArr[i].pos.y + 32
							) {
							if (
								enemyArr[i].behavior == 'goToRoom' ||
								enemyArr[i].behavior == 'inRoom' ||
								enemyArr[i].behavior == 'enterToRoom' ||
								enemyArr[i].behavior == 'exitFromRoom'
								) {
								continue
							}
							this.enemy = enemyArr[i]

							if (this.enemy.behavior == 'fear' || this.enemy.behavior == 'fearPreTimeout') {
								this.isFeared = true
							} else if (this.enemy.behavior == 'shocked' && Special.shock.isFeared) {
								this.isFeared = true
								Special.shock.reset(1)
								Special.shock.reset(2)
							} else {
								this.isFeared = false
							}

							behaviorController.setIsBusted.call(this.enemy)
							this.state = 1

							this.emitter = Effects.emitter.add(Imgs.blood, this.enemy.pos.x + 16, this.enemy.pos.y + 16, 128, 32, 50, 16, 'line', function () {
								this.pos.x = Special.cord.enemy.pos.x + 16
								this.pos.y = Special.cord.enemy.pos.y + 16
							})
							//bloodline
							this.bloodLine.x = this.enemy.pos.x
							this.bloodLine.y = this.enemy.pos.y
							this.bloodLine.lLB = new LowLayerBuffer(Imgs.bloodLine, function () {
								if (!Special.cord.enemy) {
									return
								}
								switch (Special.cord.direction) {
									case 0:
										this.picArr[0].pos.w = Special.cord.enemy.pos.x - Special.cord.bloodLine.x
									break
									case 1:
										this.picArr[0].pos.h = Special.cord.enemy.pos.y - Special.cord.bloodLine.y
									break
									case 2:
										this.picArr[0].pos.w = Special.cord.enemy.pos.x - Special.cord.bloodLine.x + 32
									break
									case 3:
										this.picArr[0].pos.h = Special.cord.enemy.pos.y - Special.cord.bloodLine.y + 32
									break
								}
							}, 1000 / Game.fps, 1, 10000)
							switch (this.direction) {
								case 0:
									pic = new Pic(0, 0, 96, 32, this.bloodLine.x, this.bloodLine.y, this.enemy.pos.x - this.bloodLine.x, 32)
								break
								case 1:
									pic = new Pic(96, 0, 32, 96, this.bloodLine.x, this.bloodLine.y, 32, this.enemy.pos.y - this.bloodLine.y)
								break
								case 2:
									pic = new Pic(128, 0, 96, 32, this.bloodLine.x, this.bloodLine.y, this.enemy.pos.x - this.bloodLine.x, 32)
								break
								case 3:
									pic = new Pic(224, 0, 32, 96, this.bloodLine.x, this.bloodLine.y, 32, this.enemy.pos.y - this.bloodLine.y)
								break
							}
							this.bloodLine.lLB.picArr.push(pic)
							gl.lowLayer.push(this.bloodLine.lLB)
							break
						}
					}
				}
				//check end
				if (this.distance <= 0) {
					this.reset(0)
					if (this.enemy) {
						this.reset(2)
						if (this.isFeared) {
							Sounds.bones.play()
							behaviorController.killEnemy(this.enemy)
							Effects.emitter.add(Imgs.blood, this.enemy.pos.x + 16, this.enemy.pos.y + 16, 64, 8, 50, 16, 'line', function(){}, 300)
							this.reset(1)
						} else {
							this.reset(1)
							behaviorController.killPlayer()
							return
						}
					}
					Special.playerGo()
				}
			}, this.speed)
			//cord
			this.lLB = new LowLayerBuffer(Imgs.cord, function () {
				this.picArr[0].w = Special.cord.distance * Math.abs(Special.cord.vec.x) + 4
				this.picArr[0].h = Special.cord.distance * Math.abs(Special.cord.vec.y) + 4
				this.picArr[0].pos.w = Special.cord.distance * Special.cord.vec.x + 4
				this.picArr[0].pos.h = Special.cord.distance * Special.cord.vec.y + 4
			}, 1000 / Game.fps, 1)
			var pic = new Pic(0, 0, 4, 4, this.x, this.y, 4, 4)
			this.lLB.picArr.push(pic)
			gl.lowLayer.push(this.lLB)

			this.cooldownEnable()
		}
	},
	bomb: {
		__proto__: {
			cooldownEnable: cooldownEnable,
			cooldownDisable: cooldownDisable
		},
		timer: 0,
		ready: true,
		level: 0,
		emitter: false,
		emitter2: false,
		interval: false,
		cooldownHandle: null,
		cooldown: 30,
		radius: 0,
		speed: 51,
		lLB: false,
		setDefault: function () {
			this.cooldownDisable()
			this.reset(0)
		},
		getRadius: function () {
			return 32 + 8 * this.level
		},
		reset: function (state) {
			switch (state) {
				case 0:
					if (this.lLB) {
						this.lLB.removeBuffer()
						this.lLB = false
					}
					if (this.emitter) {
						this.emitter.remove()
						this.emitter = false
					}
					if (this.emitter2) {
						this.emitter2.remove()
						this.emitter2 = false
					}
					if (this.interval) {
						_Tools.clearInterval(this.interval)
						this.interval = false
					}
					Effects.earthquake.stop()
					this.radius = 0
				break
			}
		},
		start: function () {
			//init
			Special.playerStop()
			//skill interval
			this.interval = _Tools.setInterval.call(this, function () {
				//increase radius
				this.radius += this.getRadius() / 10
				//check end
				if (this.radius >= this.getRadius()) {
					this.reset(0)
					Special.playerGo()
					return
				}
				//check enemy
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
						Effects.emitter.add(Imgs.blood, enemy.pos.x + 16, enemy.pos.y + 16, 64, 8, 50, 16, 'line', function () {}, 300)
						behaviorController.killEnemy(enemy)
					}
				})
			}, this.speed)
			//boom
			this.lLB = new LowLayerBuffer(Imgs.bomb, function () {
				this.picArr[0].pos.x = Player.pos.x + 16 - Special.bomb.radius
				this.picArr[0].pos.y = Player.pos.y + 16 - Special.bomb.radius
				this.picArr[0].pos.w = Special.bomb.radius * 2
				this.picArr[0].pos.h = Special.bomb.radius * 2
			}, 1000 / Game.fps, 1)
			var pic = new Pic(0, 0, 112, 112, Player.pos.x + 16 - this.radius, Player.pos.y + 16 - this.radius, this.radius * 2, this.radius * 2)
			this.lLB.picArr.push(pic)
			gl.lowLayer.push(this.lLB)
			//fire
			this.emitter = Effects.emitter.add(Imgs.bombParticle, Player.pos.x + 16, Player.pos.y + 16, this.getRadius() * 2, 12, 50, 16, 'line', function () {}, 400)
			//smoke
			this.emitter2 = Effects.emitter.add(Imgs.smokeParticle, Player.pos.x + 16, Player.pos.y + 16, this.getRadius() * 2, 12, 100, 24, 'line', function () {}, 400)
			//earthquake
			Effects.earthquake.start()
			//cooldown
			this.cooldownEnable()
		}
	},
	shot: {
		__proto__: {
			cooldownEnable: cooldownEnable,
			cooldownDisable: cooldownDisable
		},
		timer: 0,
		level: 0,
		ready: true,
		speed: 50,
		cooldownHandle: null,
		cooldown: 7,
		handle: null,
		lLB: false,
		direction: 0,
		setDefault: function () {
			this.cooldownDisable()
			if (this.lLB) {
				this.lLB.removeBuffer()
			}
			_Tools.clearTimeout(this.handle)
		},
		chanse: function () {
			return 10 * this.level
		},
		start: function () {
			//init
			_Data.status = "special";
			Special.playerStop()
			this.direction = Player.curAction
			//select type
			var pic
			if (Events.gain.quaddamage) {
				this.handle = _Tools.setTimeout(function () {
					Special.playerGo()
				}, 200)
				//sound
				Sounds.quadshot.play()
				//fire animation
				this.lLB = new LowLayerBuffer(Imgs.quadshot, function (){
					this.curFrame++
					if (this.curFrame >= this.tFrames) {
						this.curFrame = 0
					}
					this.picArr[0].x = this.curFrame * 32
				}, this.speed, 4, 200)
				var x = Math.floor(Player.pos.x / 32)
				var y = Math.floor(Player.pos.y / 32)
				switch (this.direction) {
					case 0:
						while (x > 0 && !_Map.grid[x - 1][y].object.block) {
							x--
						}
						pic = new Pic(0, 32, 32, 32, x * 32, y * 32, Player.pos.x + 16 - x * 32, 32)
					break
					case 1:
						while (!_Map.grid[x][y - 1].object.block) {
							y--
						}
						pic = new Pic(0, 0, 32, 32, Player.pos.x, y * 32, 32, Player.pos.y + 16 - y * 32)
					break
					case 2:
						while (x < 20 && !_Map.grid[x + 1][y].object.block) {
							x++
						}
						pic = new Pic(0, 32, 32, 32, Player.pos.x + 16, Player.pos.y, x * 32 - Player.pos.x + 16, 32)
					break
					case 3:
						while (!_Map.grid[x][y + 1].object.block) {
							y++
						}
						pic = new Pic(0, 0, 32, 32, Player.pos.x, Player.pos.y + 16, 32, y * 32 - Player.pos.y + 16)
					break
				}
			} else {
				this.handle = _Tools.setTimeout(function () {
					Special.playerGo()
				}, 100)
				//sound
				Sounds.shot.play()
				//fire animation
				this.lLB = new LowLayerBuffer(Imgs.fireOfShot, function(){}, this.speed, 1, 100)
				switch (Player.curAction) {
					case 0:
						pic = new Pic(0, 0, 96, 32, Player.pos.x - 68, Player.pos.y, 96, 32)
					break
					case 1:
						pic = new Pic(96, 0, 32, 96, Player.pos.x, Player.pos.y - 68, 32, 96)
					break
					case 2:
						pic = new Pic(128, 0, 96, 32, Player.pos.x + 4, Player.pos.y, 96, 32)
					break
					case 3:
						pic = new Pic(224, 0, 32, 96, Player.pos.x, Player.pos.y + 4, 32, 96)
					break
				}
			}
			this.lLB.picArr.push(pic)
			gl.lowLayer.push(this.lLB)
			//check enemies
			var enemies = Col.enemyInLine();

			var kills = 0
			if (enemies != false) {
				enemies.forEach(function (enemy) {
					if (
						enemy.behavior != 'goToRoom' &&
						enemy.behavior != 'enterToRoom' &&
						enemy.behavior != 'inRoom' &&
						enemy.behavior != 'exitFromRoom'
						) {
						if (Col.missCheck()) {
							Effects.emitter.add(Imgs.blood, enemy.pos.x + 16, enemy.pos.y + 16, 64, 8, 50, 16, 'line', function() {}, 300)
							Effects.blood.add(enemy)
							kills++
							behaviorController.killEnemy(enemy)
						} else {
							Mess.setMess('miss', enemy.pos)
						}
					}
				})
			}
			//sound of kill
			if (kills > 1) {
				Mess.setMess('headHunter')
				Sounds.headHunter.play()
			} else if (kills == 1) {
				Mess.setMess('headShot')
				Sounds.headshot.play()
			}

			this.cooldownEnable()
		}
	},
	shock: {
		__proto__: {
			cooldownEnable: cooldownEnable,
			cooldownDisable: cooldownDisable
		},
		timer: 0,
		interval: false,
		ready: true,
		level: 10,
		distance: 0,
		duration: 5000,
		speed: 7,
		enemy: false,
		isFeared: false,
		behavior: '',
		emitter: false,
		hLB: false,
		lLB: false,
		cooldown: 5,
		cooldownHandle: null,
		pos: {
			x: 0,
			y: 0
		},
		direction: 0,
		state: 0,
		timeToEnd: 0,
		setDefault: function () {
			this.cooldownDisable()
			this.reset(0)
			this.reset(1)
			this.reset(2)
		},
		reset: function (state) {
			switch (state) {
				case 0:
					if (this.emitter) {
						this.emitter.remove()
						this.emitter = false
					}
					if (this.lLB) {
						this.lLB.removeBuffer()
						this.lLB = false
					}
				break
				case 1:
					if (this.hLB) {
						this.hLB.removeBuffer()
						this.hLB = false
					}
					this.isFeared = false
					this.behavior = ''
				break
				case 2:
					if (this.interval) {
						_Tools.clearInterval(this.interval)
						this.interval = false
						this.enemy = false
						this.timeToEnd = 0
						this.distance = 0
						this.state = 0
					}
				break
			}
		},
		start: function () {
			//init
			this.direction = Player.curAction
			this.pos.x = Player.pos.x
			this.pos.y = Player.pos.y
			//skill interval
			this.interval = _Tools.setInterval.call(this, function () {
				switch (this.state) {
					case 0:
							//set position
						switch (this.direction) {
							case 0:
								this.pos.x = Player.pos.x - this.distance
								this.pos.y = Player.pos.y
							break
							case 1:
								this.pos.x = Player.pos.x
								this.pos.y = Player.pos.y - this.distance
							break
							case 2:
								this.pos.x = Player.pos.x + this.distance + 32
								this.pos.y = Player.pos.y
							break
							case 3:
								this.pos.x = Player.pos.x
								this.pos.y = Player.pos.y + this.distance + 32
							break

						}
						// increase distance
						Special.shock.distance += 4
						//check collision
						if (
							this.pos.x < 0 ||
							this.pos.x + 32 > 672 ||
							_Map.grid[Math.floor(this.pos.x / 32)][Math.floor(this.pos.y / 32)].object.block ||
							_Map.grid[Math.floor((this.pos.x + 31) / 32)][Math.floor((this.pos.y + 31) / 32)].object.block
							) {
							this.reset(0)
							this.reset(2)
							return
						}
						//check enemy
						this.enemy = Col.checkEnemy.call(this)

						if (this.enemy) {

							if (
								this.enemy.behavior == 'goToRoom'||
								this.enemy.behavior == 'enterToRoom'||
								this.enemy.behavior == 'exitFromRoom'||
								this.enemy.behavior == 'inRoom'
								) {
								return
							}

							this.reset(0)
							this.state = 1

							if (this.enemy.behavior == 'fear' || this.enemy.behavior == 'fearPreTimeout') {
								this.isFeared = true
							} else {
								this.isFeared = false
							}
							this.behavior = this.enemy.behavior

							behaviorController.setShocked.call(this.enemy)
							// shocked animation
							this.hLB = new HighLayerBuffer(Imgs.shocked, function () {

								this.picArr[0].x = this.curFrame * 32

								this.curFrame++
								if (this.curFrame == this.tFrames) {
									this.curFrame = 0
								}
							}, 200, 2)
							var pic = new Pic(0, 0, 32, 32, this.enemy.pos.x, this.enemy.pos.y, 32, 32)
							this.hLB.picArr.push(pic)
							gl.highLayer.push(this.hLB)							
						}

					break
					case 1:
						this.timeToEnd += this.speed
						if (this.timeToEnd >= this.duration * (this.level / 10)) {
							if (Events.energiser.activated) {
								if (Events.energiser.timeToEnd <= Events.energiser.duration * 0.3) {
									behaviorController.setFearPreTimeout.call(this.enemy)
								} else {
									behaviorController.setFear.call(this.enemy)
								}
							} else {
								switch (this.behavior) {
									case 'chase':
										behaviorController.setChase.call(this.enemy)
									break
									case 'passive':
										behaviorController.setPassive.call(this.enemy)
									break
								}
							}
							this.reset(1)
							this.reset(2)
						}
					break
				}
			}, this.speed)

			//emitter
			this.emitter = Effects.emitter.add(Imgs.shockParticle, this.pos.x + 16, this.pos.y + 16, 64, 4, 50, 16, 'line', function () {
				this.pos.x = Special.shock.pos.x + 16
				this.pos.y = Special.shock.pos.y + 16
			})

			//ball
			this.lLB = new LowLayerBuffer(Imgs.shock, function () {
				this.picArr[0].pos.x = Special.shock.pos.x
				this.picArr[0].pos.y = Special.shock.pos.y
			}, this.speed, 1, 1000)
			var pic = new Pic(0, 0, 32, 32, Special.shock.pos.x, Special.shock.pos.y, 32, 32)
			this.lLB.picArr.push(pic)
			gl.lowLayer.push(this.lLB)

			//cooldown
			this.cooldownEnable()
		}
	},
	icons: {
		addIcon: function (img, getParams, getText, getPos) {
			var highLayerBuffer = new HighLayerBuffer(img, getParams, 1000 / Game.fps, 1, 10000000)
			gl.highLayer.push(highLayerBuffer)

			var outputTextBuffer = new OutputTextBuffer(getText, color.white, 16, 'middle', 'center', true, getPos, 'text')
			gl.outputs.push(outputTextBuffer)
		},
		init: function () {
			//Cord icon
			this.addIcon(Imgs.icons.cord, function () {
				var pic = {
					y: 0,
					w: 32,
					h: 32,
					pos: {
						x: 276,
						y: 516,
						w: 24,
						h: 24
					}
				}

				if (Special.cord.ready && Special.cord.level > 0) {
					pic.x = 0
				} else {
					pic.x = 32
				}

				this.picArr = []
				this.picArr.push(pic)
			}, function () {
				if (Special.cord.timer == 0) {
					return ""
				} else {
					return Special.cord.timer
				}
			}, function () {
				return {
					x: 288,
					y: 528
				}
			})

			//Shot icon
			this.addIcon(Imgs.icons.shot, function () {
				var pic = {
					y: 0,
					w: 32,
					h: 32,
					pos: {
						x: 308,
						y: 516,
						w: 24,
						h: 24
					}
				}

				if (Special.shot.ready && Special.shot.level > 0) {
					pic.x = 0
				} else {
					pic.x = 32
				}

				this.picArr = []
				this.picArr.push(pic)
			}, function () {
				if (Special.shot.timer == 0) {
					return ""
				} else {
					return Special.shot.timer
				}
			}, function () {
				return {
					x: 320,
					y: 528
				}
			})
			//Shock icon
			this.addIcon(Imgs.icons.shock, function () {
				var pic = {
					y: 0,
					w: 32,
					h: 32,
					pos: {
						x: 340,
						y: 516,
						w: 24,
						h: 24
					}
				}

				if (Special.shock.ready && Special.shock.level > 0) {
					pic.x = 0
				} else {
					pic.x = 32
				}

				this.picArr = []
				this.picArr.push(pic)
			}, function () {
				if (Special.shock.timer == 0) {
					return ""
				} else {
					return Special.shock.timer
				}
			}, function () {
				return {
					x: 352,
					y: 528
				}
			})
			//Bomb icon
			this.addIcon(Imgs.icons.bomb, function () {
				var pic = {
					y: 0,
					w: 32,
					h: 32,
					pos: {
						x: 372,
						y: 516,
						w: 24,
						h: 24
					}
				}

				if (Special.bomb.ready && Special.bomb.level > 0) {
					pic.x = 0
				} else {
					pic.x = 32
				}

				this.picArr = []
				this.picArr.push(pic)
			}, function () {
				if (Special.bomb.timer == 0) {
					return ""
				} else {
					return Special.bomb.timer
				}
			}, function () {
				return {
					x: 384,
					y: 528
				}
			})
		}
	}
}