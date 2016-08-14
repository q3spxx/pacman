var Scope = {
	main: 40000,
	points: 0,
	check_end_game: function () {
		if (this.points == 146) {
			Controller.game_pause();
			Scope.points = 0
			clearInterval(Room.handle)
			audio.forEach( function (sound) {
				if (!sound.paused) {
					sound.pause()
					sound.currentTime = 0
				}
			})
			Special.get_over_here.cooldown = 0
			Special.bomb.cooldown = 0
			Special.shot.cooldown = 0
			_data.firstblood = true
			_data.status = "end game"
			Shop.open()
			console.log("end game");
		};
	}
};