var _Data = {
	canvas: {
		elem: null
	},
	imgsIsLoaded: false,
	center_mess_switch: false,
	center_mess: "",
	set_center_mess: function (mess) {
		this.center_mess = mess;
	},
	kill: false,
	kills: 0,
	kill_update: 0,
	total_kills: 0,
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
			_data.kill = false;
			_data.kills = 0;
		}, 3000);
	},
	volume: 0.00,
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
	lifes: 3,
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
	change_sound: function (arr) {
		arr.forEach(function (sound) {
			if (!sound.paused) {
				sound.pause()
				sound.currentTime = 0
			};
		});
	}
};