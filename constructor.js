function newGrid () {
	var grid = [];
	for (var x = 0; x < 21; x++) {
		var xArr = [];
		for (var y = 0; y < 21; y++) {
			var cell = new Cell(x * 32, y * 32);
			xArr.push(cell);
		};
		grid.push(xArr);
	};
	return grid;
};

var cellProto = {
	makeEmpty: function () {
		this.img = {
			pic: imgs[0],
			pos: {
				x: 0,
				y: 0
			}
		}
		this.type = 0;
		this.block = false;
	}
};
function Cell (x, y) {
	this.__proto__ = cellProto;
	this.img = null;
	this.block = false;
	this.x = x;
	this.y = y;
	this.type = 0;
};
function AnimBuf (id, person) {
	this.__proto__ = person;
	this.id = id;
	this.curFrame = 0;
	this.tFrames = 2;
};
function CellOfGP (x, y, status) {
	this.status = status;
	this.x = x;
	this.y = y;
};

function AI_Prototype () {
	this.go_to_room = function () {
		Controller.stop.call(this);
		if (room.length == 3) {
			this.exit_from_room.call(this);
		};
		this.pos.x = 288 + 32 * room.length;
		this.pos.y = 288;
		room.push(this);
	};
	this.exit_from_room = function () {
		var e = room[room.length - 1];
		room.splice(2, 1);
		e.pos.x = 320;
		e.pos.x = 224;
		b_Controller.setPassive.call(e);
		Controller.start.call(e);
	};
};

function tBuf (text, pos, size, color, type) {
	this.text = text;
	this.pos = pos;
	this.size = size;
	this.color = color;
	this.type = type;
	this.cur_frame = 0;
	this.t_frame = Anim.type[type].length - 1;
};