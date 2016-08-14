var _data = {
	center_mess_switch: false,
	center_mess: "",
	set_center_mess: function (mess) {
		this.center_mess = mess;
	},
	kill: false,
	kills: 0,
	kill_update: 0,
	kill_timer: function () {

		if (_data.kill) {
			_data.kill_update += 1;
		};

		_data.kill = true;

		setTimeout(function () {

			if (_data.kill_update > 0) {
				_data.kill_update -= 1;
				return;
			};

			if (_data.kills > 1) {
				var say = false
				var mess = Sounds.mess
				switch (_data.kills) {
					case 2: say = Sounds.dominating
							mess = "Dominating!"
					break
					case 3: say = Sounds.unstoppable
							mess = "Unstoppabale!"
					break
					case 4: say = Sounds.rampage
							mess = "Rampage!"
					break
				}
				if(say != false) {
					_data.change_sound(audio_mess)
					Sounds.show_mess(mess)
					say.play()
				}
			};
			_data.kill = false;
			_data.kills = 0;
		}, 3000);
	},
	volume: 0.1,
	firstblood: true,
	change_volume: function (input) {
		_data.volume = Number(input.value) / 100;
		audio.forEach( function (sound) {
			sound.volume = _data.volume;
		});
	},
	status: null,
	game_speed: 6,
	level: 1,
	lives: 3,
	reinit_level: function () {
		setTimeout(function () {
			console.log("reinit")

			init_player_position()

			init_enemy_position()

			Sounds.signal.play();

			Controller.game_continue();

		}, 1600);
	},
	next_level: function () {

		_Map.update()

		init_player_position()

		init_enemy_position()

		_data.level += 1

		start()

	},
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
	},
	change_sound: function (arr) {
		arr.forEach(function (sound) {
			if (!sound.paused) {
				sound.pause()
				sound.currentTime = 0
			};
		});
	}
};