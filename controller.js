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
						case 'passive': ai.passive.call(this)
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
		},
		setShocked: function () {
			this.stop()
			this.path = []
			this.behavior = 'shocked'
		},
		killEnemy: function (enemy) {
			enemy.goToRoom()
			var points = 100 * Math.pow(2, Kill.getGain()) * Events.gain.value
			_Data.addPoints(points)
			Mess.setMess(points, enemy.pos)
			Kill.activate()
			Kill.massKill.activate()
		},
		killPlayer: function () {
			Game.stop()
			Player.isDead();
			_Data.lifes--
			_Tools.setTimeout(function () {
				if (_Data.lifes > 0) {
					Game.default()
					Game.start()
				} else {
					Mess.setMess('gameOver')
				}
			}, 900)
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
			lowLayerBuffer: null,
			eventMap: [],
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
				this.addGain(Imgs.star, function () {
					Sounds.quaddamage.play()
					Events.gain.quaddamage = true
				}, function () {
					Events.gain.quaddamage = false
				})
			}
		},
		tosty: {
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
		}
	}