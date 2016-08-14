var Shop = {
	on: false,
	mess: '',
	x: 32,
	y: 192,
	w: 608,
	h: 192,
	try_buy: function () {
		if (Scope.main < Shop.data.skills.products[Shop.cursor.target].price) {
			this.mess = 'No money - no honey!'
			return
		}
		Shop.data.skills.products[Shop.cursor.target].level_up()
	},
	cursor: {
		x: 30,
		y: 50,
		target: 0,
		up: function () {
			if (this.target == 0) {
				return
			}
			this.target -= 1
			this.y -= 32
		},
		down: function () {
			if (Shop.data.skills.products.length - 1 == this.target) {
				return
			}
			this.target += 1
			this.y += 32
		}
	},
	data: {
		skills: {
			x: 30,
			y: 50,
			products: [
				{
					name: 'Cord',
					icon: null,
					price: 1000,
					level: function () {
						return Special.get_over_here.level
					},
					level_up: function () {
						if (this.level() == 10) {
							return
						}
						Scope.main -= this.price
						Special.get_over_here.level += 1
						Shop.mess = this.name + ': level ' + this.level()
						this.price = Math.floor(this.price * 1.1)
					}
				},
				{
					name: 'Shot',
					icon: null,
					price: 2000,
					level: function () {
						return Special.shot.level
					},
					level_up: function () {
						if (this.level() == 10) {
							return
						}
						Scope.main -= this.price
						Special.shot.level += 1
						Shop.mess = this.name + ': level ' + this.level()
						this.price = Math.floor(this.price * 1.1)
					}
				},
				{
					name: 'Bomb',
					icon: null,
					price: 3000,
					level: function () {
						return Special.bomb.level
					},
					level_up: function () {
						if (this.level() == 10) {
							return
						}
						Scope.main -= this.price
						Special.bomb.level += 1
						Shop.mess = this.name + ': level ' + this.level()
						this.price = Math.floor(this.price * 1.1)
					}
				}
			]
		}
	},
	open: function () {
		_data.status = 'shop'
		Sounds.shop.play()
		this.on = true
	},
	close: function () {
		_data.status = 'ready'
		Sounds.shop.pause()
		Sounds.shop.currentTime = 0
		this.on = false
		this.mess = ''
		_data.next_level()
	}
}