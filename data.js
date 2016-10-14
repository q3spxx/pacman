var _Data = {
	canvas: {
		elem: null
	},
	imgsIsLoaded: false,
	intervals: [],
	timeouts: [],
	volume: 0.0,
	level: 1,
	lifes: 3,
	gameSpeed: 5,
	roundPoints: 0,
	scope: 0,
	addPoints: function (points) {
		this.scope += points
	},
	checkEndRound: function () {
		if (this.roundPoints == MapObjects.foods.array.length) {
			console.log("End round")
			this.level++
			this.roundPoints = 0

			Game.stop()
			Game.default()
			_Map.default()
			Game.begin()
		}
	},
	roundDefault: function () {
		this.roundPoints = 0
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
	firstblood: true,
	change_volume: function (input) {
		_data.volume = Number(input.value) / 100;
		audio.forEach( function (sound) {
			sound.volume = _data.volume;
		});
	},
	status: null,
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
	}
	massKill: {
		
	}
}