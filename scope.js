var Scope = {
	main: 0,
	points: 0,
	check_end_game: function () {
		if (this.points == 146) {
			Controller.game_pause();
			Scope.points = 0
			clearInterval(Room.handle)
			clearTimeout(Event.random_event_handle)
			audio.forEach( function (sound) {
				if (!sound.paused) {
					sound.pause()
					sound.currentTime = 0
				}
			})
			Special.get_over_here.cooldown = 0
			Special.bomb.cooldown = 0
			Special.shot.cooldown = 0
			Special.shock.cooldown = 0
			Event.stop()
			Dynamic_blocks.door[0].block = true;
			Dynamic_blocks.door[0].img.pos = {x: 96, y: 0};
			_data.total_kills = 0
			_data.firstblood = true
			_data.status = "end game"
			Shop.open()
			console.log("end game");
		};
	}
};