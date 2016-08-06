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

		Room.go.call(this)
	};
	this.exit_from_room = function () {
		Room.exit.call(this)
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