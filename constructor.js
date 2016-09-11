function Grid () {
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

function EventCell (x, y, type) {
	this.x = x
	this.y = y
	this.type = type
}
function Buf_event (name, pic, pos) {
	this.id = _Tools.gen_id()
	this.name = name
	this.img = {}
	this.img.pic = pic
	this.img.pos = pos
	this.pos = {
		x: 0,
		y: 0
	}
	this.w = 32
	this.h = 32
	this.cur_frame = 0
	this.t_frames = 2
}

function Block (name, pic, pos) {
	this.id = _Tools.gen_id()
	this.name = name
	this.pic = pic
	this.pos = pos
	this.setProp = function (prop, value) {
		this[prop] = value
	}
	this.getProp = function (prop) {
		return this[prop]
	}
}


function MapObject (name, image, block, symbol, type) {
	this.id = _Tools.gen_id()
	this.name = name
	this.block = block
	this.image = image
	this.symbol = symbol
	this.type = type
	this.num = null
	this.graphObject = null
	this.changeState = function (image, block) {
		this.image = image
		this.block = block
	}

}

function Category (states) {
	this.id = 0
	this.array = []
	this.states = states
}

function Item (name, o, category) {
	this.curState = 0
	this.gridLink = o
	this.states = MapObjects[category].states
	this.changeState = function () {
		this.curState++
		if (this.curState > this.states.length - 1) {
			this.curState = 0
		};

		this.gridLink.image = Blocks[this.states[this.curState].image]
		this.gridLink.block = this.states[this.curState].block
		this.gridLink.graphObject = this.states[this.curState].block
	}
}

var Cell__proto__ = {
	setObject: function (name, symbol, category) {
		this.object = $.extend(true, {}, MapObjects[name])
		if (category) {
			MapObjects.addItem(category, symbol, name, this.object)
		};
	}
}
function Cell (x, y) {
	this.__proto__ = Cell__proto__
	this.x = x;
	this.y = y;
	this.object = null
};
function Animation (img, x, y, w, h, totalFrames, repeat) {
	this.img = img
	this.frames = []
	this.repeat = repeat

	for (var i = 0; i < totalFrames; i++) {
		this.frames.push({
			x: i * w,
			y: y,
			w: w,
			h: h
		})
	}
}
function AnimationBuffer (context, name) {
	this.id = _Tools.gen_id()
	this.pos = context.pos;
	this.curFrame = 0;
	this.img = context.anim[name].img
	this.totalFrames = context.anim[name].frames.length;
	this.frames = context.anim[name].frames
	this.repeat = context.anim[name].repeat;
};

function GraphCell (x, y, num) {
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
	this.pos = {x: 0, y: 0}
	this.mPos = {
		x: 0,
		y: 0
	}
	this.handle = null
	this.curAction = 0
	this.speed = 7
	this.anim = Anim.lib.pacman
	this.animationBufferId = null
	this.isDead = function () {
		this.stop();
		this.changeAnimation("dead")
	}
	this.setDefault = function () {
		this.pos.x = 320
		this.pos.y = 480
		this.mPos.x = 0
		this.mPos.y = 0
		this.left()
	}
}

function _Enemy (id, pos, anim, behavior) {
	this.id = id
	this.pos = {x: 0, y: 0}
	this.shocked = false
	this.mPos = {
		x: 0,
		y: 0
	}
	this.handle = null
	this.anim = anim
	this.animationBufferId = null
	this.curAction = 0
	this.speed = 8
	this.path = []
	this.pointPos = {x: 0, y: 0}
	this.behavior = behavior
	this.default = {
		pos: pos,
		behavior: behavior
	}
	this.setDefault = function () {
		this.pos.x = this.default.pos.x
		this.pos.y = this.default.pos.y
		this.behavior = this.default.behavior
		this.mPos.x = 0
		this.mPos.y = 0
		this.shocked = false
		this.curAction = 0
		this.path = []
		this.pointPos = {x: 0, y: 0}
		this.left()
	}
}

function Character () {
	this.left = function () {
		this.mPos.x = -1;
		this.mPos.y = 0;
		this.curAction = 0;
		this.changeAnimation("left")
	}
	this.right = function () {
		this.mPos.x = 1;
		this.mPos.y = 0;
		this.curAction = 2;
		this.changeAnimation("right")
	}
	this.up = function () {
		this.mPos.x = 0;
		this.mPos.y = -1;
		this.curAction = 1;
		this.changeAnimation("up")
	}
	this.down = function () {
		this.mPos.x = 0;
		this.mPos.y = 1;
		this.curAction = 3;
		this.changeAnimation("down")
	}
	this.stop = function () {
		this.mPos.x = 0;
		this.mPos.y = 0;
	}
	this.changeAnimation = function (name) {
		Anim.removeAnimationBuffer(this.animationBufferId)
		Anim.addAnimationBuffer(this, name)
	}
}

function AIPrototype () {
	this.setFearImg = function () {
		this.img = Imgs.fear;
	};
	this.setFearPreTimeoutImg = function () {
		this.img = Imgs.fear_pre_timeout;
	};
	this.set_goToRoomImg = function () {
		this.img = Imgs.go_to_room;
	};
	this.goToRoom = function () {

		Room.go.call(this)
	};
	this.exitFromRoom = function () {
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