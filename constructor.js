function new_grid () {
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

function Block (name, pic, pos, block, id, in_map, type) {
	this.id = id
	this.name = name
	this.img = {}
	this.img.pic = pic
	this.img.pos = pos
	this.block = block
	this.type = type
	this.in_map = in_map
	this.type = type
}

var cell_proto = {
	makeEmpty: function () {
		this.img = {
			pic: Imgs.empty,
			pos: {
				x: 0,
				y: 0
			}
		}
		this.id = 0;
		this.block = false;
		this.type = 'statics'
	}
};
function Cell (x, y) {
	this.x = x;
	this.y = y;
	this.make_empty = function () {
		this.__proto__ = Static_blocks.empty
	}
};
function AnimBuf (id, person, tf, repeat) {
	this.__proto__ = person;
	this.id = id;
	this.curFrame = 0;
	this.tFrames = tf;
	this.repeat = repeat;
};

function Graph_cell (x, y, num) {
	this.x = x
	this.y = y
	this.f = null
	this.g = null
	this.h = null
	this.neighs = []
	this.parent = null
	this.arr = null
	this.num = num
}

function _Player () {
	this.id = 4
	this.pos = {x: 320, y: 480}
	this.m_pos = {
		x: 0,
		y: 0
	}
	this.handle = null
	this.img = Imgs.pacman
	this.curAction = 0
	this.speed = 7
	this.is_dead = function () {
		this.img = Imgs.dead;
		this.stop();
		var aBuf = new AnimBuf(0, this, 5, false);
		this.curAction = 4;
		anim[0] = aBuf;
	}
}

function _Enemy (id, pos, img, point_pos, behavior) {
	this.id = id
	this.pos = pos
	this.m_pos = {
		x: 0,
		y: 0
	}
	this.handle = null
	this.img = img
	this.curAction = 0
	this.speed = 8
	this.path = []
	this.point_pos = point_pos
	this.behavior = behavior
	this.set_original_img = function () {
		this.img = img;
	}
}

function Character (pos, img, speed) {
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
	this.action = [
		{
			frames: [
				{
					x: 0,
					y: 0
				},
				{
					x: 0,
					y: 32
				}
			]
		},
		{
			frames: [
				{
					x: 32,
					y: 0
				},
				{
					x: 32,
					y: 32
				}
			]
		},
		{
			frames: [
				{
					x: 64,
					y: 0
				},
				{
					x: 64,
					y: 32
				}
			]
		},
		{
			frames: [
				{
					x: 96,
					y: 0
				},
				{
					x: 96,
					y: 32
				}
			]
		}
	]
}

function AI_Prototype (img, point_pos, behavior) {
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

function Shock_buf (img, x, y, w, h) {
	this.id = _data.gen_id()
	this.img = img
	this.x = x
	this.y = y
	this.w = w
	this.h = h
}