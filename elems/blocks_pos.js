var BlocksPos = {
	get_wall_pos: function () {
		var arr = [
			{x: 1, y: 0},
			{x: 2, y: 0},
			{x: 3, y: 0},
			{x: 4, y: 0},
			{x: 5, y: 0},
			{x: 6, y: 0},
			{x: 7, y: 0},
			{x: 8, y: 0},
			{x: 9, y: 0},
			{x: 10, y: 0},
			{x: 11, y: 0},
			{x: 12, y: 0},
			{x: 13, y: 0},
			{x: 14, y: 0},
			{x: 15, y: 0},
			{x: 16, y: 0},
			{x: 17, y: 0},
			{x: 18, y: 0},
			{x: 19, y: 0},

			{x: 1, y: 1},
			{x: 10, y: 1},
			{x: 19, y: 1}
			,
			{x: 1, y: 2},
			{x: 3, y: 2},
			{x: 4, y: 2},
			{x: 6, y: 2},
			{x: 7, y: 2},
			{x: 8, y: 2},
			{x: 10, y: 2},
			{x: 12, y: 2},
			{x: 13, y: 2},
			{x: 14, y: 2},
			{x: 16, y: 2},
			{x: 17, y: 2},
			{x: 19, y: 2},

			{x: 1, y: 3},
			{x: 19, y: 3},

			{x: 1, y: 4},
			{x: 3, y: 4},
			{x: 4, y: 4},
			{x: 6, y: 4},
			{x: 8, y: 4},
			{x: 9, y: 4},
			{x: 10, y: 4},
			{x: 11, y: 4},
			{x: 12, y: 4},
			{x: 14, y: 4},
			{x: 16, y: 4},
			{x: 17, y: 4},
			{x: 19, y: 4},

			{x: 1, y: 5},
			{x: 6, y: 5},
			{x: 10, y: 5},
			{x: 14, y: 5},
			{x: 19, y: 5},

			{x: 1, y: 6},
			{x: 2, y: 6},
			{x: 3, y: 6},
			{x: 4, y: 6},
			{x: 6, y: 6},
			{x: 7, y: 6},
			{x: 8, y: 6},
			{x: 10, y: 6},
			{x: 12, y: 6},
			{x: 13, y: 6},
			{x: 14, y: 6},
			{x: 16, y: 6},
			{x: 17, y: 6},
			{x: 18, y: 6},
			{x: 19, y: 6},

			{x: 4, y: 7},
			{x: 6, y: 7},
			{x: 14, y: 7},
			{x: 16, y: 7},

			{x: 0, y: 8},
			{x: 1, y: 8},
			{x: 2, y: 8},
			{x: 3, y: 8},
			{x: 4, y: 8},
			{x: 6, y: 8},
			{x: 8, y: 8},
			{x: 9, y: 8},
			{x: 11, y: 8},
			{x: 12, y: 8},
			{x: 14, y: 8},
			{x: 16, y: 8},
			{x: 17, y: 8},
			{x: 18, y: 8},
			{x: 19, y: 8},
			{x: 20, y: 8},

			{x: 8, y: 9},
			{x: 12, y: 9},

			{x: 0, y: 10},
			{x: 1, y: 10},
			{x: 2, y: 10},
			{x: 3, y: 10},
			{x: 4, y: 10},
			{x: 6, y: 10},
			{x: 8, y: 10},
			{x: 9, y: 10},
			{x: 10, y: 10},
			{x: 11, y: 10},
			{x: 12, y: 10},
			{x: 14, y: 10},
			{x: 16, y: 10},
			{x: 17, y: 10},
			{x: 18, y: 10},
			{x: 19, y: 10},
			{x: 20, y: 10},

			{x: 4, y: 11},
			{x: 6, y: 11},
			{x: 14, y: 11},
			{x: 16, y: 11},

			{x: 1, y: 12},
			{x: 2, y: 12},
			{x: 3, y: 12},
			{x: 4, y: 12},
			{x: 6, y: 12},
			{x: 8, y: 12},
			{x: 9, y: 12},
			{x: 10, y: 12},
			{x: 11, y: 12},
			{x: 12, y: 12},
			{x: 14, y: 12},
			{x: 16, y: 12},
			{x: 17, y: 12},
			{x: 18, y: 12},
			{x: 19, y: 12},

			{x: 1, y: 13},
			{x: 10, y: 13},
			{x: 19, y: 13},

			{x: 1, y: 14},
			{x: 3, y: 14},
			{x: 4, y: 14},
			{x: 6, y: 14},
			{x: 7, y: 14},
			{x: 8, y: 14},
			{x: 10, y: 14},
			{x: 12, y: 14},
			{x: 13, y: 14},
			{x: 14, y: 14},
			{x: 16, y: 14},
			{x: 17, y: 14},
			{x: 19, y: 14},

			{x: 1, y: 15},
			{x: 4, y: 15},
			{x: 16, y: 15},
			{x: 19, y: 15},

			{x: 1, y: 16},
			{x: 2, y: 16},
			{x: 4, y: 16},
			{x: 6, y: 16},
			{x: 8, y: 16},
			{x: 9, y: 16},
			{x: 10, y: 16},
			{x: 11, y: 16},
			{x: 12, y: 16},
			{x: 14, y: 16},
			{x: 16, y: 16},
			{x: 18, y: 16},
			{x: 19, y: 16},

			{x: 1, y: 17},
			{x: 6, y: 17},
			{x: 10, y: 17},
			{x: 14, y: 17},
			{x: 19, y: 17},

			{x: 1, y: 18},
			{x: 3, y: 18},
			{x: 4, y: 18},
			{x: 5, y: 18},
			{x: 6, y: 18},
			{x: 7, y: 18},
			{x: 8, y: 18},
			{x: 10, y: 18},
			{x: 12, y: 18},
			{x: 13, y: 18},
			{x: 14, y: 18},
			{x: 15, y: 18},
			{x: 16, y: 18},
			{x: 17, y: 18},
			{x: 19, y: 18},

			{x: 1, y: 19},
			{x: 19, y: 19},

			{x: 1, y: 20},
			{x: 2, y: 20},
			{x: 3, y: 20},
			{x: 4, y: 20},
			{x: 5, y: 20},
			{x: 6, y: 20},
			{x: 7, y: 20},
			{x: 8, y: 20},
			{x: 9, y: 20},
			{x: 10, y: 20},
			{x: 11, y: 20},
			{x: 12, y: 20},
			{x: 13, y: 20},
			{x: 14, y: 20},
			{x: 15, y: 20},
			{x: 16, y: 20},
			{x: 17, y: 20},
			{x: 18, y: 20},
			{x: 19, y: 20}
		]
		return arr;
	},
	get_empty_pos: function  () {
		var arr = [];
		for (var x = 0; x < 21; x++) {
			for (var y = 0; y < 21; y++) {
				arr.push({x: x, y: y});
			};
		};
		return arr;
	},
	get_food_pos: function () {
		var arr = [
			{x: 2, y: 1},
			{x: 3, y: 1},
			{x: 4, y: 1},
			{x: 5, y: 1},
			{x: 6, y: 1},
			{x: 7, y: 1},
			{x: 8, y: 1},
			{x: 9, y: 1},
			{x: 11, y: 1},
			{x: 12, y: 1},
			{x: 13, y: 1},
			{x: 14, y: 1},
			{x: 15, y: 1},
			{x: 16, y: 1},
			{x: 17, y: 1},
			{x: 18, y: 1},

			{x: 2, y: 2},
			{x: 5, y: 2},
			{x: 9, y: 2},
			{x: 11, y: 2},
			{x: 15, y: 2},
			{x: 18, y: 2},

			{x: 2, y: 3},
			{x: 3, y: 3},
			{x: 4, y: 3},
			{x: 5, y: 3},
			{x: 6, y: 3},
			{x: 7, y: 3},
			{x: 8, y: 3},
			{x: 9, y: 3},
			{x: 10, y: 3},
			{x: 11, y: 3},
			{x: 12, y: 3},
			{x: 13, y: 3},
			{x: 14, y: 3},
			{x: 15, y: 3},
			{x: 16, y: 3},
			{x: 17, y: 3},
			{x: 18, y: 3},

			{x: 2, y: 4},
			{x: 5, y: 4},
			{x: 7, y: 4},
			{x: 13, y: 4},
			{x: 15, y: 4},
			{x: 18, y: 4},

			{x: 2, y: 5},
			{x: 3, y: 5},
			{x: 4, y: 5},
			{x: 5, y: 5},
			{x: 7, y: 5},
			{x: 8, y: 5},
			{x: 9, y: 5},
			{x: 11, y: 5},
			{x: 12, y: 5},
			{x: 13, y: 5},
			{x: 15, y: 5},
			{x: 16, y: 5},
			{x: 17, y: 5},
			{x: 18, y: 5},

			{x: 5, y: 6},
			{x: 15, y: 6},

			{x: 5, y: 7},
			{x: 15, y: 7},

			{x: 5, y: 8},
			{x: 15, y: 8},

			{x: 5, y: 9},
			{x: 15, y: 9},

			{x: 5, y: 10},
			{x: 15, y: 10},

			{x: 5, y: 11},
			{x: 15, y: 11},

			{x: 5, y: 12},
			{x: 15, y: 12},

			{x: 2, y: 13},
			{x: 3, y: 13},
			{x: 4, y: 13},
			{x: 5, y: 13},
			{x: 6, y: 13},
			{x: 7, y: 13},
			{x: 8, y: 13},
			{x: 9, y: 13},
			{x: 11, y: 13},
			{x: 12, y: 13},
			{x: 13, y: 13},
			{x: 14, y: 13},
			{x: 15, y: 13},
			{x: 16, y: 13},
			{x: 17, y: 13},
			{x: 18, y: 13},

			{x: 2, y: 14},
			{x: 5, y: 14},
			{x: 9, y: 14},
			{x: 11, y: 14},
			{x: 15, y: 14},
			{x: 18, y: 14},

			{x: 2, y: 15},
			{x: 3, y: 15},
			{x: 5, y: 15},
			{x: 6, y: 15},
			{x: 7, y: 15},
			{x: 8, y: 15},
			{x: 9, y: 15},
			{x: 11, y: 15},
			{x: 12, y: 15},
			{x: 13, y: 15},
			{x: 14, y: 15},
			{x: 15, y: 15},
			{x: 17, y: 15},
			{x: 18, y: 15},

			{x: 3, y: 16},
			{x: 5, y: 16},
			{x: 7, y: 16},
			{x: 13, y: 16},
			{x: 15, y: 16},
			{x: 17, y: 16},

			{x: 2, y: 17},
			{x: 3, y: 17},
			{x: 4, y: 17},
			{x: 5, y: 17},
			{x: 7, y: 17},
			{x: 8, y: 17},
			{x: 9, y: 17},
			{x: 11, y: 17},
			{x: 12, y: 17},
			{x: 13, y: 17},
			{x: 15, y: 17},
			{x: 16, y: 17},
			{x: 17, y: 17},
			{x: 18, y: 17},

			{x: 2, y: 18},
			{x: 9, y: 18},
			{x: 11, y: 18},
			{x: 18, y: 18},

			{x: 2, y: 19},
			{x: 3, y: 19},
			{x: 4, y: 19},
			{x: 5, y: 19},
			{x: 6, y: 19},
			{x: 7, y: 19},
			{x: 8, y: 19},
			{x: 9, y: 19},
			{x: 10, y: 19},
			{x: 11, y: 19},
			{x: 12, y: 19},
			{x: 13, y: 19},
			{x: 14, y: 19},
			{x: 15, y: 19},
			{x: 16, y: 19},
			{x: 17, y: 19},
			{x: 18, y: 19}
		]

		return arr
	},
	get_door_pos: function () {
		var arr = [
			{x: 10, y: 8}
		]
		return arr
	},
	get_energiser_pos: function () {
		var arr = [
			{x: 2, y: 3},
			{x: 2, y: 17},
			{x: 18, y: 3},
			{x: 18, y: 17}
		]
		return arr
	},
	getEventMap: function () {
		var res =   'nbbbbbbbbbbbbbbbbbbbn' +
					'nbeeeeeeeebeeeeeeeebn' +
					'nbebbebbbebebbbebbebn' +
					'nbbeeeeeeeeeeeeeeebbn' +
					'nbebbebebbbbbebebbebn' +
					'nbeeeebeeebeeebeeeebn' +
					'nbbbbebbbebebbbebbbbn' +
					'nnnnbebeeeeeeebebnnnn' +
					'bbbbbebebbbbbebebbbbb' +
					'eeeeeeeebbbbbeeeeeeee' +
					'bbbbbebebbbbbebebbbbb' +
					'nnnnbebeeeeeeebebnnnn' +
					'nbbbbebebbbbbebebbbbn' +
					'nbeeeeeeeebeeeeeeeebn' +
					'nbebbebbbebebbbebbebn' +
					'nbeebeeeeeeeeeeebeebn' +
					'nbbebebebbbbbebebebbn' +
					'nbbeeebeeebeeebeeebbn' +
					'nbebbbbbbebebbbbbbebn' +
					'nbeeeeeeeeeeeeeeeeebn' +
					'nbbbbbbbbbbbbbbbbbbbn' 
		return res
	},
	getMap: function () {
		var res =   'ewwwwwwwwwwwwwwwwwwwe' +
					'ewffffffffwffffffffwe' +
					'ewfwwfwwwfwfwwwfwwfwe' +
					'ewgfffffffffffffffgwe' +
					'ewfwwfwfwwwwwfwfwwfwe' +
					'ewffffwfffwfffwffffwe' +
					'ewwwwfwwwfwfwwwfwwwwe' +
					'eeeewfweeeeeeewfweeee' +
					'wwwwwfwewwdwwewfwwwww' +
					'eeeeefeeweeeweefeeeee' +
					'wwwwwfwewwwwwewfwwwww' +
					'eeeewfweeeeeeewfweeee' +
					'ewwwwfwewwwwwewfwwwwe' +
					'ewffffffffwffffffffwe' +
					'ewfwwfwwwfwfwwwfwwfwe' +
					'ewffwfffffffffffwffwe' +
					'ewwfwfwfwwwwwfwfwfwwe' +
					'ewgfffwfffwfffwfffgwe' +
					'ewfwwwwwwfwfwwwwwwfwe' +
					'ewfffffffffffffffffwe' +
					'ewwwwwwwwwwwwwwwwwwwe' 
		return res
	}
}