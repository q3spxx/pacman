var Controller = {
		start: function () {
			this.handle = _Tools.setInterval.call(this, function () {

				if (this.id != 4) {
					switch (this.behavior) {
						case 'chase': ai.searchPath.call(this)
						break
						case 'fear': ai.fear.call(this)
						break
						case "fearPreTimeout": ai.fear.call(this)
						break
						case 'passive': ai.passive.method.call(this)
						break
						case 'shocked': return
						break
						case 'isBusted':
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
			}.bind(this), this.speed);
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
			if (ai.passive.player) {
				behaviorController.setChase.call(this)
				return
			}
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
		setIsBusted: function () {
			this.behavior = 'isBusted'
			this.path = []
			this.mPos.x = 0
			this.mPos.y = 0
		},
		setShocked: function () {
			this.behavior = 'shocked'
			this.path = []
			this.stop()
		},
		killEnemy: function (enemy) {
			if (enemy.behavior == 'shocked') {
				Special.shock.reset(1)
				Special.shock.reset(2)
			}
			enemy.goToRoom()

			var chase = false
			for (var i = 0; i < enemyArr.length; i++) {
				if (enemyArr[i].behavior == 'chase') {
					chase = true
					break
				}
			}

			if (!chase) {
				ai.passive.player = false
			}

			var points = 100 * Math.pow(2, Kill.getGain()) * Events.gain.value
			_Data.addPoints(points)
			Mess.setMess(points, enemy.pos)
			Kill.activate()
			Kill.massKill.activate()
		},
		killPlayer: function () {
			Game.stop()
			Sounds.fon.pause()
			Sounds.dead.play()
			Player.isDead();
			_Data.lifes--
			Kill.massKill.reset()
			_Tools.setTimeout(function () {
				if (_Data.lifes > 0) {
					Game.default()
					Game.start()
				} else {
					Mess.setMess('gameOver')
				}
			}, 1800)
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
					} else if (enemy.behavior == "shocked") {
						Special.shock.isFeared = true
						enemy.changeAnimation('fearLeft')
					}
					ai.passive.player = false
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
		gain: {
			gains: [],
			curGain: false,
			sustain: 10,
			activated: false,
			interval: null,
			pos: {
				x: 0,
				y: 0
			},
			timer: null,
			timeToStart: 0,
			timeToEnd: 10,
			timeToDeactivate: 10,
			value: 1,
			quaddamage: false,
			lowLayerBuffer: false,
			eventMap: [],
			quaddamageReady: false,
			countDown: function () {
				this.timeToStart = 10 + Math.floor(Math.random() * 10)
				this.timer = _Tools.setInterval.call(this, function () {
					if (this.timeToStart == 0) {
						_Tools.clearInterval(this.timer)
						this.show()
					} else {
						this.timeToStart--
					}
				}, 1000)
			},
			show: function () {
				var randomGain = Math.floor(Math.random() * this.gains.length)
				this.curGain = this.gains[randomGain]
				var randomPos = Math.floor(Math.random() * this.eventMap.length)

				this.pos.x =  Events.gain.eventMap[randomPos].x * 32
				this.pos.y =  Events.gain.eventMap[randomPos].y * 32

				this.lowLayerBuffer = new LowLayerBuffer(this.curGain.img, function () {
					var pic = {
						y: 0,
						w: 32,
						h: 32,
						pos: {
							x: Events.gain.pos.x,
							y: Events.gain.pos.y,
							w: 32,
							h: 32
						}
					}
					switch (this.curFrame) {
						case 0:
							pic.x = 0
						break
						case 1:
							pic.x = 32
						break
					}
					this.curFrame++
					if (this.curFrame >= this.tFrames) {
						this.curFrame = 0
					}
					this.picArr = []
					this.picArr.push(pic)
				}, 200, 2)
				gl.lowLayer.push(this.lowLayerBuffer)


				this.timeToEnd = this.sustain
				this.interval = _Tools.setInterval.call(this, function () {
					if (this.timeToEnd == 0) {
						this.hide()
						this.curGain = false
						this.countDown()
					} else {
						this.timeToEnd--
					}
				}, 1000)
			},
			hide: function () {
				this.lowLayerBuffer.removeBuffer()
				this.lowLayerBuffer = false
				_Tools.clearInterval(this.interval)
			},
			activate: function () {
				_Tools.clearInterval(this.timer)
				this.activated = true
				this.curGain.start()
				this.hide()
				this.interval = _Tools.setInterval.call(this, function () {
					if (this.timeToDeactivate == 0) {
						this.deactivate()
					} else {
						this.timeToDeactivate--
					}
				}, 1000)
			},
			deactivate: function () {
				this.activated = false
				_Tools.clearInterval(this.interval)
				this.timeToDeactivate = 10
				this.curGain.stop()
				this.curGain = false
				this.countDown()
			},
			addGain: function (img, start, stop) {
				var gain = new Gain(img, start, stop)
				this.gains.push(gain)
			},
			setDefault: function () {
				_Tools.clearInterval(this.interval)
				_Tools.clearInterval(this.timer)
				this.quaddamage = false
				this.activated = false
				this.curGain = false
				this.value = 1
				if (this.lowLayerBuffer != false) {
					this.lowLayerBuffer.removeBuffer()
				}
			},
			init: function () {
				var eventMap = BlocksPos.getEventMap()
				eventMap = eventMap.split("")
				var index = 0;
				for (var y = 0; y < 21; y++) {
					for (var x = 0; x < 21; x++) {
						if (eventMap[index] == "e") {
							this.eventMap.push({x: x, y: y})
						}
						index++
					}
				}

				this.addGain(Imgs.gainX2, function () {
					Events.gain.value = 2
				}, function () {
					Events.gain.value = 1
				})
				this.addGain(Imgs.gainX3, function () {
					Events.gain.value = 3
				}, function () {
					Events.gain.value = 1
				})
			}
		},
		tosty: {
			ready: false,
			timer: null,
			sustain: 30,
			timeToStart: 0,
			x: 672,
			y: 672,
			highLayerBuffer: false,
			activated: false,
			timeout: null,
			countDown: function () {
				this.timeToStart = this.sustain + Math.floor(Math.random() * 30)
				this.timer = _Tools.setInterval.call(this, function () {
					if (this.timeToStart == 0) {
						_Tools.clearInterval(this.timer)
						this.activate()
					} else {
						this.timeToStart--
					}
				}, 1000)
			},
			activate: function () {
				this.activated = true
				Sounds.tosty.play()
				Mess.setMess('pressSpace')
				this.highLayerBuffer = new HighLayerBuffer(Imgs.tosty, function () {
					this.picArr = []
					this.picArr.push({
						x: 0,
						y: 0,
						w: 110,
						h: 110,
						pos: {
							x: Events.tosty.x,
							y: Events.tosty.y,
							w: 110,
							h: 110
						}
					})
					if (Events.tosty.x > 562 || Events.tosty.y > 562) {
						Events.tosty.x -= 20
						Events.tosty.y -= 20
					}
				}, 1000 / Game.fps, 1)
				gl.highLayer.push(this.highLayerBuffer)

				this.timeout = _Tools.setTimeout.call(this, function () {
					Mess.hideMess('pressSpace')
					this.highLayerBuffer.removeBuffer()
					this.highLayerBuffer = false
					this.activated = false
					this.x = 672
					this.y = 672
					this.countDown()
				}, 1000)
			},
			setDefault: function () {
				_Tools.clearInterval(this.timer)
				_Tools.clearTimeout(this.timeout)
				this.x = 672
				this.y = 672
				this.activated = false
				if (this.highLayerBuffer != false) {
					this.highLayerBuffer.removeBuffer()
					this.highLayerBuffer = false
				}
			}
		},
		finishHim: {
			lowLayerBuffer: null,
			highLayerBuffer: null,
			ready: false,
			activated: false,
			execution: false,
			enemy: false,
			word: '',
			cursor: false,
			openedWords: ['boom'],
			activate: function (enemy) {
				this.enemy = enemy
				this.cursor = new LowLayerBuffer(Imgs.fhcursor, function () {
					if (this.picArr.length == 0) {
						var pic = new Pic(0, 0, 32, 32, Events.finishHim.enemy.pos.x, Events.finishHim.enemy.pos.y, 32, 32)
						this.picArr.push(pic)
					}
				}, 33, 1)
				gl.lowLayer.push(this.cursor)

				this.activated = true
				_Data.status = 'finishHimKeyword'
				Sounds.finishHim.play()
				Sounds.finishHimFx.play()
				_Tools.setTimeout.call(this, function () {
					Sounds.finishHimFon.play()
				}, 500)
				Mess.setMess('enterKeyword')
				Mess.setMess('keyword')
				this.lowLayerBuffer = new LowLayerBuffer(Imgs.gray, function () {
					this.picArr = []
					for (var x = 0; x < 21; x++) {
						for (var y = 0; y < 21; y++) {
							this.picArr.push({
								x: 32 * this.curFrame,
								y: 0,
								w: 32,
								h: 32,
								pos: {
									x: x * 32,
									y: y * 32,
									w: 32,
									h: 32
								}
							})
						}
					}
					this.curFrame++
					if (this.curFrame > this.tFrames) {
						this.curFrame = this.tFrames
					}
				}, 200, 4)
				gl.lowLayer.push(this.lowLayerBuffer)

				this.highLayerBuffer = new HighLayerBuffer(Imgs.finishHim, function () {
					this.picArr = []
					this.picArr.push({
						x: 308 * this.curFrame,
						y: 0,
						w: 308,
						h: 178,
						pos: {
							x: 182,
							y: 64,
							w: 308,
							h: 178
						}
					})
					this.curFrame++
					if (this.curFrame > 9 &&  !Events.finishHim.execution) {
						this.curFrame = 8
					} else {
						if (this.curFrame > this.tFrames) {
							this.removeBuffer()
						}
					}
				}, 1000 / Game.fps * 2, 15)
				gl.highLayer.push(this.highLayerBuffer)
			},
			addChar: function (char) {
				this.word = this.word + char
				if (this.checkAccess()) {
					_Data.status = 'finishHimExecution'
					Mess.hideMess('enterKeyword')
					Mess.hideMess('keyword')
					Sounds.finishHimFon.pause()
					Sounds.finishHimFon.currentTime = 0
					Sounds.finishHimFx2.play()
					this.execution = true
					console.log("access")
					this.cursor.removeBuffer()
					this.lib[this.word].method()
				}
			},
			deleteChar: function () {
				var word = this.word.split("")
				word.splice(word.length - 1, 1)
				this.word = word.join('')
			},
			checkAccess: function () {
				for (var i = 0; i < this.openedWords.length; i++) {
					if (this.word == this.openedWords[i]) {
						return true
					}
				}
				return false
			},
			fatality: function () {
				Sounds.fatality.play()
				var highLayerBuffer = new HighLayerBuffer(Imgs.fatality, function () {
					this.picArr = []
					this.picArr.push({
						x: 0,
						y: 0,
						w: 512,
						h: 177,
						pos: {
							x: 80,
							y: 80,
							w: 512,
							h: 177
						}
					})
				}, 1000 / Game.fps, 1, 2000)
				gl.highLayer.push(highLayerBuffer)

			},
			lib: {
				boom: {
					width: 0,
					emitter: false,
					highLayerBuffer: false,
					method: function () {
						var enemy = Events.finishHim.enemy
						var boom = Events.finishHim.lib.boom

						Sounds.boomdeath.play()

						_Tools.setTimeout.call(this, function () {
							this.emitter = Effects.emitter.add(Imgs.blood, enemy.pos.x + 16, enemy.pos.y + 16, 64, 8, 50, 32, 'line', function() {}, 200)
							this.highLayerBuffer = new HighLayerBuffer(Imgs.boomblood, function () {
								if (this.picArr.length == 0) {
									var pic = new Pic(	0, 
														0, 
														96, 
														96, 
														enemy.pos.x + 16 + (boom.width / 2 * -1),
														enemy.pos.y + 16 + (boom.width / 2 * -1),
														boom.width,
														boom.width
														)
									this.picArr.push(pic)
								}

								this.picArr[0].pos.x = enemy.pos.x + 16 + (boom.width / 2 * -1)
								this.picArr[0].pos.y = enemy.pos.y + 16 + (boom.width / 2 * -1)
								this.picArr[0].pos.w = boom.width
								this.picArr[0].pos.h = boom.width

								boom.width += 8
								if (boom.width > 128) {
									boom.width = 128
								}
							}, 10, 1)
							gl.highLayer.push(this.highLayerBuffer)
						}, 330)

						var distance = Math.sqrt(Math.pow(enemy.pos.x - 672, 2) + Math.pow(enemy.pos.y - 672, 2))
						var speed = distance / 24
						var vec = {
							x: (672 - enemy.pos.x) / distance,
							y: (672 - enemy.pos.y) / distance
						}
						var highLayerBuffer = new HighLayerBuffer(Imgs.ball, function () {
							if (this.picArr.length == 0) {
								var pic = new Pic(0, 0, 128, 128, 672, 672, 128, 128)
								this.size = 1
								this.picArr.push(pic)
							}
							this.picArr[0].pos.x -= vec.x * speed
							this.picArr[0].pos.y -= vec.y * speed
							if (this.picArr[0].pos.w == 32 || this.picArr[0].pos.h == 32) {
								this.size = -1
							}
							this.picArr[0].pos.w -= 4 * this.size
							this.picArr[0].pos.h -= 4 * this.size
						}, 16, 1, 1584)
						gl.highLayer.push(highLayerBuffer)


						_Tools.setTimeout.call(this, function () {
							Events.finishHim.fatality()
						}, 1000)
						_Tools.setTimeout.call(this, function () {
							this.highLayerBuffer.removeBuffer()
							Events.finishHim.lowLayerBuffer.removeBuffer()
							Events.finishHim.word = ""
							Events.finishHim.enemy = false
							Events.finishHim.execution = false
							Events.finishHim.activated = false
							Shop.open()
						}, 3000)
					}
				}
			}
		}
	}