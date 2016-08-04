var empty;
function initEmpty () {
	var arr = [];
	for (var x = 0; x < 21; x++) {
		for (var y = 0; y < 21; y++) {
			arr.push({	
						img: {
							pic: imgs[0],
							pos: imgElems.empty
						},
						block: false,
						x: x, 
						y: y,
						type: 0
					});
		};
	};
	return arr;
};
var door;
function initDoor () {
	var arr = [];
	var o = {
		img: {
			pic: imgs[0],
			pos: imgElems.door
		},
		block: true,
		x: 10,
		y: 8,
		type: 3
	};
	arr.push(o)
	return arr;
};
function open_door () {
	Map.grid[10][8].block = false;
	Map.grid[10][8].img.pos = imgElems.empty;
};
function close_door () {
	Map.grid[10][8].block = true;
	Map.grid[10][8].img.pos = imgElems.door;
};
var energiser;
function initEnergiser () {
	var arr = [];
	for (var i = 0; i < 4; i++) {
		var o = {
			img: {
				pic: imgs[0],
				pos: imgElems.energiser
			},
			block: false,
			x: 0,
			y: 0,
			type: 4
		};
		arr.push(o)
	};
	arr[0].x = 2;
	arr[0].y = 3;

	arr[1].x = 2;
	arr[1].y = 17;

	arr[2].x = 18;
	arr[2].y = 3;

	arr[3].x = 18;
	arr[3].y = 17;
	return arr;
};

var Room = {
	list: [],
	position: [
		{
			x: 10,
			y: 9
		},
		{
			x: 9,
			y: 9
		},
		{
			x: 11,
			y: 9
		}
	],
	go: function () {
		this.pointPos = {
			x: 10,
			y: 7
		}
	},
	enter: function () {
		Room.list.push(this);
		this.pointPos = Room.position[Room.list.length - 1];
		b_Controller.set_enter_to_room.call(this);
	},
	exit: function () {
		this.pointPos = {
			x: 10,
			y: 7
		}
		b_Controller.set_exit_from_room.call(this)
	}
};