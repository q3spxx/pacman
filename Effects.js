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
				var x = Math.floor(Math.cos(angle) * randomDistance)
				var y = Math.floor(Math.sin(angle) * randomDistance)
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
		particle: function (parent, callback) {
			this.id = _Tools.genId()
			this.__proto__ = Effects.emitter.particleProto
			this.handle = null
			this.state = 0
			this.parent = parent
			this.distance = Math.floor(this.parent.radius * Math.random())
			this.size = Math.floor(Math.random() * parent.size)
			this.img = this.parent.img
			this.callback = callback
			this.x = 0
			this.y = 0

			var angle = Math.floor(360 * Math.random())
			this.vector = {
				x: Math.round(Math.cos(angle) * this.parent.radius / 4),
				y: Math.round(Math.sin(angle) * this.parent.radius / 4)
			}
			this.handle = _Tools.setInterval.call(this, function () {
				if (this.state > this.distance) {
					_Tools.clearInterval(this.handle)
					this.removeParticle()
					this.parent.createParticle()
				}
				this.x += this.vector.x
				this.y += this.vector.y
				this.size *= 1 - (1 / this.distance)
				this.state++
			}.bind(this), this.parent.speed)


		},
		particleProto: {
			removeParticle: function () {
				_Tools.clearInterval(this.handle)
				for (var i = 0; i < this.parent.particles.length; i++) {
					if (this.id == this.parent.particles[i].id) {
						this.parent.particles.splice(i, 1)
						return
					}
				}
			},
			pause: function () {
				for (var i = 0; i < _Data.intervals.length; i++) {
					if (_Data.intervals[i].id == this.handle) {
						_Data.intervals[i].pause()
						return
					}
				}
			},
			continue: function () {
				for (var i = 0; i < _Data.intervals.length; i++) {
					if (_Data.intervals[i].id == this.handle) {
						_Data.intervals[i].continue()
						return
					}
				}
			}
		},
		emitter: function (img, x, y, radius, speed, countParticles, sizeParticle, ms, callback) {
			this.id = _Tools.genId()
			this.handle = null
			this.__proto__ = Effects.emitter.emitterProto
			this.pos = {
				x: x,
				y: y
			},
			this.img = img
			this.size = sizeParticle
			this.radius = radius
			this.speed = speed
			this.particles = []
			for (var i = 0; i < countParticles; i++) {
				this.createParticle(callback)
			}

			if (ms != undefined) {
				this.handle = _Tools.setTimeout.call(this, function () {
					this.remove()
				}.bind(this), ms)
			}

			if (callback != undefined) {
			}
		},
		emitterProto: {
			createParticle: function (callback) {
				var particle = new Effects.emitter.particle(this, callback)
				this.particles.push(particle)
				return
			},
			pause: function () {
				this.particles.forEach(function (particle) {
					particle.pause()
				})
			},
			continue: function () {
				this.particles.forEach(function (particle) {
					particle.continue()
				})
			},
			remove: function () {
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
		add: function (img, x, y, radius, speed, countParticles, sizeParticle, ms, callback) {
			var emitter = new this.emitter(img, x, y, radius, speed, countParticles, sizeParticle, ms, callback)
			gl.emitters.push(emitter)
			return emitter
		},
		lib: {
			line: function () {
				return
			}
		}
	}
}