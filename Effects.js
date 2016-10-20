var Effects = {
	blood: {
		particles: 50,
		angle: 30,
		maxDistance: 96,
		maxSize: 10,
		Particle: function (x, y, size, parent) {
			this.x = x
			this.y = y
			this.size = size
			this.parent = parent
		},
		add: function (char) {

			var distance = 0
			var xPos = Math.floor(char.pos.x / 32)
			var yPos = Math.floor(char.pos.y / 32)
			var effectPos = {
				x: char.pos.x + 16,
				y: char.pos.y + 16
			}
			var direction
			var directionAngle

			switch (Player.curAction) {
				case 0: 
					direction = {x: -1, y: 0}
					directionAngle = 180
				break
				case 1: 
					direction = {x: 0, y: -1}
					directionAngle = 270
				break
				case 2: 
					direction = {x: 1, y: 0}
					directionAngle = 0
				break
				case 3: 
					direction = {x: 0, y: 1}
					directionAngle = 90.1
				break
			}

			while (distance != this.maxDistance) {
				if (_Map.grid[Math.floor((effectPos.x + distance * direction.x) / 32)][Math.floor((effectPos.y + distance * direction.y) / 32)].object.block) {
					distance--
					break
				}
				distance++
			}
			var saturation = distance / this.maxDistance

			var particles = []
			var effectBuffer = new Effect(particles, effectPos.x, effectPos.y, Imgs.blood)
			var lowDistance = Math.floor(this.particles * 0.1)
			var lowDistanceSum = 0

			while (particles.length < this.particles * saturation) {
				var randomDistance = Math.floor(Math.random() * distance)
				if (randomDistance <= distance * 0.3) {
					if (lowDistance < lowDistanceSum) {
						randomDistance = Math.floor((Math.random() * distance * 0.7) + (distance * 0.3))
					}
					lowDistanceSum++
				}
				var angle = Number((((Math.random() * this.angle) - this.angle / 2 + directionAngle) * Math.PI / 180).toFixed(2))
				var x = Math.cos(angle) * randomDistance
				var y = Math.sin(angle) * randomDistance
				var size = Math.floor(this.maxSize - (this.maxSize * (randomDistance / distance)))
				if (size < this.maxSize * 0.2) {
					size = Math.floor(this.maxSize * 0.2)
				}
				var particle = new this.Particle(x, y, size, effectBuffer)
				effectBuffer.particles.push(particle)
			}


			effectBuffer.intervalId = _Tools.setInterval.call(effectBuffer, function () {
				if (this.delay == 0) {
					for (var i = 0; i < gl.effects.length; i++) {
						if (gl.effects[i].id == this.id) {
							gl.effects.splice(i, 1)
							break
						}
					}
					_Tools.clearInterval(this.intervalId)
					return
				}
				this.delay -= 1
			}.bind(effectBuffer), 1000)
			gl.effects.push(effectBuffer)
		}
	},
	emitter: {
		particle: function (parent) {
			this.id = _Tools.genId()
			this.__proto__ = Effects.emitter.particleProto
			this.parent = parent
			this.distance = 0
			this.maxSize = Math.floor(Math.random() * parent.maxSize)
			this.speed = Math.floor(Math.random() * parent.maxSpeed + 1)
			this.size = this.maxSize
			this.x = 0
			this.y = 0
			this.angle = Math.floor(360 * Math.random())
		},
		particleProto: {
			removeParticle: function () {
				for (var i = 0; i < this.parent.particles.length; i++) {
					if (this.id == this.parent.particles[i].id) {
						_Tools.clearInterval(this.handle)
						this.parent.particles.splice(i, 1)
						this.removeParticle(this.id)
						return
					}
				}
			},
			update: function () {
				this.parent.callback.call(this)
			}
		},
		emitter: function (img, x, y, radius, maxSpeed, countParticles, maxSize, callback, ms) {
			this.id = _Tools.genId()
			this.__proto__ = Effects.emitter.emitterProto
			this.pos = {
				x: x,
				y: y
			},
			this.img = img
			this.maxSize = maxSize
			this.radius = radius
			this.maxSpeed = maxSpeed
			this.particles = []
			this.timer = 0
			this.createInterval = _Tools.setInterval.call(this, function () {
				if (this.timer == countParticles) {
					_Tools.clearInterval(this.createInterval)
				}
				this.createParticle()
				this.timer++
			}, 2)

			if (callback != undefined) {
				this.callback = Effects.emitter.lib[callback]
			}

			if (ms != undefined) {
				this.handle = _Tools.setTimeout.call(this, function () {
					this.remove()
				}.bind(this), ms)
			}

			this.interval = _Tools.setInterval.call(this, function () {
				this.particles.forEach(function (particle) {
					particle.update()
				})
			}.bind(this), 1000 / Game.fps * Math.random())
		},
		emitterProto: {
			createParticle: function (callback) {
				var particle = new Effects.emitter.particle(this)
				this.particles.push(particle)
				return
			},
			remove: function () {
				_Tools.clearInterval(this.interval)
				while (this.particles.length > 0) {
					this.particles[0].removeParticle()
				}
				for (var i = 0; i < gl.emitters.length; i++) {
					if (this.id == gl.emitters[i].id) {
						gl.emitters.splice(i, 1)
						return
					}
				}
			}
		},
		add: function (img, x, y, radius, speed, countParticles, sizeParticle, callback, ms) {
			var emitter = new this.emitter(img, x, y, radius, speed, countParticles, sizeParticle, callback, ms)
			gl.emitters.push(emitter)
			return emitter
		},
		lib: {
			line: function () {
				if (this.distance > this.parent.radius) {
					this.removeParticle()
					this.parent.createParticle()
					return
				}
				this.size -= this.maxSize / (this.parent.radius / this.speed)
				this.x += Math.cos(this.angle) * this.speed
				this.y += Math.sin(this.angle) * this.speed
				this.distance += this.speed
			}
		}
	},
	earthquake: {
		interval: null,
		trigger: false,
		start: function () {
			_Data.main.y = 5
			this.interval = _Tools.setInterval.call(this, function () {
				if (this.trigger) {
					_Data.main.y += 10
					this.trigger = false
				} else {
					_Data.main.y -= 10
					this.trigger = true
				}
			}, 100)
		},
		stop: function () {
			_Data.main.y = 0
			_Tools.clearInterval(this.interval)
		}
	}
}