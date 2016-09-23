var Effects = {
	blood: {
		particles: 50,
		angle: 10,
		maxDistance: 64,
		Particle: function (x, y) {
			this.x = x
			this.y = y
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
			while (particles.length < this.particles * saturation) {
				var randomDistance = Math.floor(Math.random() * distance)
				var angle = Number((((Math.random() * this.angle) - this.angle / 2 + directionAngle) * Math.PI / 180).toFixed(2))
				var x = Math.floor(Math.cos(angle) * randomDistance)
				var y = Math.floor(Math.sin(angle) * randomDistance)
				var particle = new this.Particle(x, y)
				particles.push(particle)
			}


			var effectBuffer = new Effect(particles, effectPos.x, effectPos.y)
			effectBuffer.intervalId = _Tools.setInterval(function () {
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
	}
}