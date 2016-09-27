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
			setValue: function (value) {
				document.getElementById('volume').value = value * 100;
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
		for (var i = 0; i < 8; i++) {
			random += Math.floor(Math.random() * 9);
		}
		return Number(random);
	},
	setInterval: function (method, ms) {
		var id = _Tools.genId()
		var interval = new Interval(id, method, ms, this)
		_Data.intervals.push(interval)
		return interval.id
	},
	clearInterval: function (id) {
		for (var i = 0; i < _Data.intervals.length; i++) {
			if (_Data.intervals[i].id == id) {
				clearInterval(_Data.intervals[i].handle)
				_Data.intervals.splice(i, 1)
				return
			};
		}
	},
	setTimeout: function (method, ms) {
		var id = _Tools.genId()
		var timeout = new Timeout(id, method, ms, this)
		_Data.timeouts.push(timeout)
		return id
	},
	clearTimeout: function (id) {
		for (var i = 0; i < _Data.intervals.length; i++) {
			if (_Data.intervals[i].id == id) {
				clearTimeout(_Data.timeouts[i].handle)
				_Data.timeouts.splice(i, 1)
				return
			};
		}

	}
}