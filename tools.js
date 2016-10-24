var _Tools = {
	canvas: {
		setElem: function (elem) {
			_Data.canvas.elem = elem
		},
		setSize: function (width, height) {
			_Data.canvas.elem.width = width;
			_Data.canvas.elem.height = height;
			return true;
		},
		getContext: function () {
			var ctx = _Data.canvas.elem.getContext("2d");
			return ctx;
		}
	},
	inputs: {
		volume: {
			mousedown: false,
			y: 0,
			up: function () {
				if (_Data.volume < 1) {
					_Data.volume = _Data.volume + 0.01
					_Data.volume = Number(_Data.volume.toFixed(2))
				}
				Sounds.changeVolume()
				this.rotate()
			}, 
			down: function () {
				if (_Data.volume > 0) {
					_Data.volume = _Data.volume - 0.01
					_Data.volume = Number(_Data.volume.toFixed(2))
				}
				Sounds.changeVolume()
				this.rotate()
			},
			changeVolume: function (e) {
				if (this.mousedown) {
					if (this.y > e.clientY) {
						this.up()
					} else {
						this.down()
					}
				}
			},
			rotate: function () {
				$('#volume')[0].style.transform = 'rotate(' + Math.floor(_Data.volume * 270) + 'deg)'
			},
			mousedownEnable: function () {
				this.mousedown = true
			},
			mousedownDisable: function () {
				this.mousedown = false
			}

		}
	},
	img: {
		handle: null,
		count: 0,
		loaded: 0,
		load: function (path) {
			var img = new Image();
			img.src = path;
			this.count += 1;
			img.onload = function () {
				_Tools.img.loaded += 1;
			};
			return img;
		}
	},
	audio: {
		load: function (path) {
			var sound = new Audio();
			sound.src = path;
			return sound;
		}
	},
	genId: function () {
		var random = "";
		for (var i = 0; i < 16; i++) {
			random += Math.floor(Math.random() * 9);
		}
		return Number(random);
	},
	setInterval: function (method, ms) {
		var subscriber = new Subscriber(method, ms, this)
		TimeMap.add(subscriber)
		return subscriber.id
	},
	clearInterval: function (id) {
		for (var i = 0; i < TimeMap.subscribers.length; i++) {
			if (id == TimeMap.subscribers[i].id) {
				if (TimeMap.subscribers[i].timeMapBufferId) {
					for (var j = 0; j < Game.timeMap.length; j++) {
						if (TimeMap.subscribers[i].timeMapBufferId == Game.timeMap[j].id) {
							Game.timeMap.splice(j, 1)
							break
						}
					}
				}
				TimeMap.subscribers.splice(i, 1)
				_Tools.clearInterval(id)
				return true
			}
		}
		return false
	},
	setTimeout: function (method, ms) {
		var id = _Tools.genId()
		var timeout = new Timeout(id, method, ms, this)
		_Data.timeouts.push(timeout)
		return id
	},
	clearTimeout: function (id) {
		for (var i = 0; i < _Data.timeouts.length; i++) {
			if (_Data.timeouts[i].id == id) {
				clearTimeout(_Data.timeouts[i].handle)
				_Data.timeouts.splice(i, 1)
				return
			};
		}

	},
	enableBuffer: function () {
		this.activated = true
	},
	disableBuffer: function () {
		this.activated = false
	}

}

var TimeMap = {
	subscribers: [],
	formation: function () {
		this.subscribers.forEach(function (subscriber) {
			subscriber.time += Game.speed
			if (subscriber.time >= subscriber.ms) {
				if (subscriber.time >= subscriber.ms) {
				var timeMapBuffer = new TimeMapBuffer(subscriber)
					subscriber.timeMapBufferId = timeMapBuffer.id
					Game.timeMap.push(timeMapBuffer)
					subscriber.time -= subscriber.ms
				}
			}
		})
	},
	add: function (subscriber) {
		this.subscribers.push(subscriber)
	}
}