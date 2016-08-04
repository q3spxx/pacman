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
function AnimBuf (id, person, tf, repeat) {
	this.__proto__ = person;
	this.id = id;
	this.curFrame = 0;
	this.tFrames = tf;
	this.repeat = repeat;
};
function CellOfGP (x, y, status) {
	this.status = status;
	this.x = x;
	this.y = y;
};

function AI_Prototype () {
	this.left = function () {
		this.m_pos.x = -1;
		this.m_pos.y = 0;
		this.curAction = 0;
	}
	this.right = function () {
		this.m_pos.x = 1;
		this.m_pos.y = 0;
		this.curAction = 2;
	}
	this.up = function () {
		this.m_pos.x = 0;
		this.m_pos.y = -1;
		this.curAction = 1;
	}
	this.down = function () {
		this.m_pos.x = 0;
		this.m_pos.y = 1;
		this.curAction = 3;
	}
	this.stop = function () {
		this.m_pos.x = 0;
		this.m_pos.y = 0;
	}
	this.set_fear_img = function () {
		this.img = Imgs.fear;
	};
	this.set_fear_pre_timeout_img = function () {
		this.img = Imgs.fear_pre_timeout;
	};
	this.set_go_to_room_img = function () {
		this.img = Imgs.go_to_room;
	};
	this.go_to_room = function () {
		if (room.length == 3) {
			room[0].exit_from_room();
		};
		if (this.id == 0) {
			this.img = imgs[2];
		};
		if (this.id == 1) {
			this.img = imgs[3];
		};
		if (this.id == 2) {
			this.img = imgs[4];
		};
		if (this.id == 3) {
			this.img = imgs[5];
		};
		if (room.length == 0) {
			this.pos.x = 320;
			this.pos.y = 288;
		} else if (room.length == 1) {
			this.pos.x = 288;
			this.pos.y = 288;
		} else if (room.length == 2) {
			this.pos.x = 352;
			this.pos.y = 288;
		};
		this.behavior = 3;
		this.path = [];
		room.push(this);
	};
	this.exit_from_room = function () {
		Room.exit.call(this)
		/*open_door();

		b_Controller.set_outroom.call(this, {x: 10, y: 7});
		room.splice(0, 1);

		if (room.length != 0) {
			room.forEach(function (enemy, i) {
				var place = {
					y: 9
				};
				if (i == 0) {
					place.x = 10
				} else if (i == 1) {
					place.x = 9
				} else if (i == 2) {
					place.x = 11;
				};
				b_Controller.set_free.call(enemy, place);
			});
		};*/
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

function Special_buf (img, w, h) {
	this.id = _data.gen_id();
	this.img = img;
	this.x = Player.pos.x + 14;
	this.y = Player.pos.y + 14;
	this.w = w;
	this.h = h;
};

function Event_buf (img, x, y) {
	this.id = _data.gen_id();
	this.img = img;
	this.x = x;
	this.y = y;
};