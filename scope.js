var Scope = {
	main: 0,
	points: 0,
	check_end_game: function () {
		if (this.points == 146) {
			Controller.game_pause();
			Sounds.signal.pause();
			Sounds.signal.currentTime = 0;
			console.log("end game");
		};
	}
};