var _Data = {
	canvas: {
		elem: null
	},
	imgsIsLoaded: false,
	intervals: [],
	timeouts: [],
	volume: 0.01,
	level: 1,
	lifes: 3,
	gameSpeed: 5,
	roundPoints: 0,
	scope: 100000,
	main: {
		x: 0,
		y: 0
	},
	addPoints: function (points) {
		this.scope += points
	},
	checkEndRound: function () {
		if (this.roundPoints == MapObjects.foods.array.length) {
			console.log("End round")
			Sounds.fon.pause()
			Sounds.fon.currentTime = 0
			Game.stop()
			Shop.open()
		}
	},
	roundDefault: function () {
		this.roundPoints = 0
	}
};

var Kill = {
	gain: 1,
	getGain: function () {
		return this.gain
	},
	timer: false,
	delay: 5,
	timeToEnd: 0,
	handle: null,
	activate: function () {
		if (this.timer) {
			_Tools.clearInterval(this.handle)
		}

		this.gain++
		this.timer = true
		this.timeToEnd = this.delay

		this.handle = _Tools.setInterval(function () {
			if (this.timeToEnd == 0) {
				this.gain = 1
				this.timer = false
				_Tools.clearInterval(this.handle)
			}
			this.timeToEnd--
		}.bind(this), 1000)
	},
	massKill: {
		kills: 0,
		totalKills: 0,
		firstblood: true,
		timer: false,
		delay: 5,
		timeToEnd: 0,
		handle: null,
		activate: function () {
			this.kills++
			this.totalKills++

			if (this.firstblood) {
				_Tools.setTimeout.call(this, function() {
					Mess.setMess('firstblood')
					Sounds.firstblood.play()
				}, 1000);
				this.firstblood = false
			}

			var notification = null
			var totalNotification = null
			switch (this.kills) {
				case 0:
				break
				case 1:
				break
				case 2:
					notification = {
						sound: 'doublekill',
						mess: 'doublekill'
					}
				break
				case 3:
					notification = {
						sound: 'multikill',
						mess: 'multikill'
					}
				break
				case 4:
					notification = {
						sound: 'megakill',
						mess: 'megakill'
					}
				break
				default:
					notification = {
						sound: 'megakill',
						mess: 'megakill'
					}
			}

			switch (this.totalKills) {
				case 5:
					totalNotification = {
						sound: 'killingspree',
						mess: 'killingspree'
					}
				break
				case 10:
					totalNotification = {
						sound: 'rampage',
						mess: 'rampage'
					}
				break
				case 15:
					totalNotification = {
						sound: 'dominating',
						mess: 'dominating'
					}
				break
				case 20:
					totalNotification = {
						sound: 'unstoppable',
						mess: 'unstoppable'
					}
				break
				case 25:
					totalNotification = {
						sound: 'godlike',
						mess: 'godlike'
					}
				break
			}

			if (notification != null) {
				_Tools.setTimeout.call(this, function () {
					Mess.setMess(notification.mess)
					Sounds[notification.sound].play()
				}, 1000)
			}

			if (totalNotification != null) {
				_Tools.setTimeout.call(this, function () {
					Mess.setMess(totalNotification.mess)
					Sounds[totalNotification.sound].play()
				}, 2000)
			}

			if (this.timer) {
				_Tools.clearInterval(this.handle)
			}
			this.timer = true
			this.timeToEnd = this.delay

			this.handle = _Tools.setInterval(function () {
				if (this.timeToEnd == 0) {
					this.kills = 0
					this.timer = false
					_Tools.clearInterval(this.handle)
				}
				this.timeToEnd--
			}.bind(this), 1000)
		},
		reset: function () {
			this.totalKills = 0
		}
	}
}