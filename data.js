var _data = {
	volume: 0.05,
	change_volume: function (input) {
		_data.volume = Number(input.value) / 100;
		audio.forEach( function (sound) {
			sound.volume = _data.volume;
		});
	},
	status: null,
	game_speed: 6,
	level: 1,
	canvas: {
		elem: document.getElementById("map"),
		setSize: function (width, height) {
			this.elem.width = width;
			this.elem.height = height;
			return true;
		},
		getContext: function () {
			var ctx = this.elem.getContext("2d");
			return ctx;
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
				_data.img.loaded += 1;
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
};