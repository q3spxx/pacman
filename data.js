var _data = {
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
	}
};