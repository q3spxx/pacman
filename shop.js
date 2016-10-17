var Shop = {
	on: false,
	background: {
		x: 32,
		y: 192,
		w: 608,
		h: 300,
		color: 'rgba(64, 64, 64, 1)'
	},
	header: {
		x: 336,
		y: 214,
		color: 'rgba(' + color.white + ', 1)',
		font: "20px Arial",
		textAlign: "center",
		textBaseLine: "top",
		text: "Shop"
	},
	mess: {
		x: 336,
		y: 238,
		color: 'rgba(' + color.white + ', 1)',
		font: "16px Arial",
		textAlign: "center",
		textBaseLine: "top",
		text: "Here is mess"
	},
	product: {
		h: 36,
		icon: {
			x: 0,
			y: 0,
			w: 32,
			h: 32
		},
		title: {
			x: 60,
			y: 16,
			color: 'rgba(' + color.white + ', 1)',
			font: "16px Arial",
			textAlign: "left",
			textBaseLine: "top"
		},
		price: {
			x: 160,
			y: 16,
			color: 'rgba(' + color.white + ', 1)',
			font: "16px Arial",
			textAlign: "center",
			textBaseLine: "top"
		},
		level: {
			x: 216,
			y: 12,
			w: 32,
			h: 10,
			marginLeft: 4
		}
	},
	cursor: {
		img: {
			x: 0,
			y: 0,
			w: 548,
			h: 34
		},
		x: 30,
		y: 60,
		w: 548,
		h: 34,
		target: 0,
		quantityEmitters: 100,
		emitters: [],
		enable: function () {
			var quantityEmittersLeft = Math.floor(((this.quantityEmitters * (this.h / this.w))) / 2)
			var quantityEmittersTop = this.quantityEmitters / 2 - quantityEmittersLeft
			var radius = 16
			var speed = 1
			var quantity = 4
			var size = 8
			for (var i = 0; i < quantityEmittersTop; i++) {
				var emitterBuffer = Effects.emitter.add(Imgs.cursorParticle, Shop.background.x + Shop.cursor.x + i * (this.w / quantityEmittersTop), Shop.background.y + Shop.cursor.y, radius, speed, quantity, size, 'line')
				this.emitters.push(emitterBuffer)
			}
			for (var i = 0; i < quantityEmittersLeft; i++) {
				var emitterBuffer = Effects.emitter.add(Imgs.cursorParticle, Shop.background.x + Shop.cursor.x, Shop.background.y + Shop.cursor.y + i * (this.h / quantityEmittersLeft), radius, speed, quantity, size, 'line')
				this.emitters.push(emitterBuffer)
			}
			for (var i = 0; i < quantityEmittersTop; i++) {
				var emitterBuffer = Effects.emitter.add(Imgs.cursorParticle, Shop.background.x + Shop.cursor.x + i * (this.w / quantityEmittersTop), Shop.background.y + Shop.cursor.y + this.h, radius, speed, quantity, size, 'line')
				this.emitters.push(emitterBuffer)
			}
			for (var i = 0; i < quantityEmittersLeft; i++) {
				var emitterBuffer = Effects.emitter.add(Imgs.cursorParticle, Shop.background.x + Shop.cursor.x + this.w, Shop.background.y + Shop.cursor.y + i * (this.h / quantityEmittersLeft), radius, speed, quantity, size, 'line')
				this.emitters.push(emitterBuffer)
			}
		},
		disable: function () {
			this.emitters.forEach(function (emitter) {
				emitter.remove()
			})
			this.emitters = []
		},
		up: function () {
			if (this.target == 0) {
				return
			}
			this.target -= 1
			this.y -= 36
			this.emitters.forEach(function (emitter) {
				emitter.pos.y -= 36
			})
		},
		down: function () {
			if (Shop.data.catalog.products.length - 1 == this.target) {
				return
			}
			this.target += 1
			this.y += 36
			this.emitters.forEach(function (emitter) {
				emitter.pos.y += 36
			})
		}
	},
	data: {
		catalog: {
			x: 30,
			y: 60,
			products: []
		}
	},
	tryBuy: function () {
		if (_Data.scope < Shop.data.catalog.products[Shop.cursor.target].price) {
			this.mess.text = 'No money - no honey!'
			return
		}
		this.cursor.emitters.forEach(function (emitter) {
			emitter.maxSize = 12
			emitter.radius = 32
			emitter.speed = 4
		})
		_Tools.setTimeout.call(this, function () {
			this.cursor.emitters.forEach(function (emitter) {
				emitter.maxSize = 8
				emitter.radius = 16
				emitter.speed = 1
			})
		}, 800)
		Shop.data.catalog.products[Shop.cursor.target].levelUp()
	},
	open: function () {
		_Data.status = 'shop'
		Sounds.shop.play()
		this.cursor.enable()
		this.on = true
	},
	close: function () {
		_Data.status = 'ready'
		Sounds.shop.pause()
		Sounds.shop.currentTime = 0
		this.cursor.disable()
		this.on = false
		this.mess.text = ''
	},
	productProto: {
		levelUp: function () {
			if (this.object.level == 10) {
				Shop.mess.text = 'You are have max level of ' + this.name
				return
			}
			_Data.scope -= this.price
			this.object.level += 1
			Shop.mess.text = this.name + ' increases to level ' + this.object.level
			this.price = Math.floor(this.price * 1.1)
		}
	},
	addProduct: function (name, type, price, object, icon, levelUp) {
		var product = new Product(name, type, price, object, icon, levelUp)
		Shop.data.catalog.products.push(product)
	},
	init: function () {
		this.addProduct('Cord', 'skill', 1000, Special.cord, Imgs.icons.cord, Shop.productProto.levelUp)
		this.addProduct('Shot', 'skill', 2000, Special.shot, Imgs.icons.shot, Shop.productProto.levelUp)
		this.addProduct('Shock', 'skill', 1000, Special.shock, Imgs.icons.shock, Shop.productProto.levelUp)
		this.addProduct('Bomb', 'skill', 3000, Special.bomb, Imgs.icons.bomb, Shop.productProto.levelUp)
		this.addProduct('life', 'item', 10000, _Data, Imgs.pacman, function () {
			if (this.object.lifes == 10) {
				Shop.mess.text = 'You are have max lifes '
				return
			}
			Shop.mess.text = 'You get an extra life'
			_Data.scope -= this.price
			this.object.lifes++
		})
	}
}