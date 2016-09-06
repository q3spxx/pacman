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
	gen_id: function () {
		var random = "";
		for (var i = 0; i < 8; i++) {
			random += Math.floor(Math.random() * 9);
		}
		return Number(random);
	}
}