var Shop = {
	on: false,
	mess: '',
	x: 32,
	y: 192,
	w: 608,
	h: 260,
	try_buy: function () {
		if (Scope.main < Shop.data.catalog.products[Shop.cursor.target].price) {
			this.mess = 'No money - no honey!'
			return
		}
		Shop.data.catalog.products[Shop.cursor.target].level_up()
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
			this.y -= 34
		},
		down: function () {
			if (Shop.data.catalog.products.length - 1 == this.target) {
				return
			}
			this.target += 1
			this.y += 34
		}
	},
	data: {
		catalog: {
			x: 30,
			y: 50,
			products: [
				{
					name: 'Cord',
					type: 'skill',
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
					type: 'skill',
					price: 3000,
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
					name: 'Shock',
					icon: null,
					type: 'skill',
					price: 2000,
					level: function () {
						return Special.shock.level
					},
					level_up: function () {
						if (this.level() == 10) {
							return
						}
						Scope.main -= this.price
						Special.shock.level += 1
						Shop.mess = this.name + ': level ' + this.level()
						this.price = Math.floor(this.price * 1.1)
					}
				},
				{
					name: 'Bomb',
					icon: null,
					type: 'skill',
					price: 4000,
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
				},
				{
					name: 'Life',
					type: 'item',
					icon: null,
					price: 10000,
					level_up: function () {
						if (_data.lifes == 10) {
							Shop.mess = 'No more 10, dirty cheat!'
							return
						};
						Scope.main -= this.price
						Shop.mess = 'Additional life'
						_data.lifes += 1
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