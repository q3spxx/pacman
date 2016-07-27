var Scope = {
	main: 0,
	points: 0,
	check_end_game: function () {
		if (this.points == 146) {
			console.log("end game");
		};
	}
};