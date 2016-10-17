function Product (name, type, price, object, icon, levelUp) {
	this.levelUp = levelUp
	this.id = _Tools.genId()
	this.name = name
	this.type = type
	this.price = price
	this.object = object
	this.icon = icon
}

function Subscriber (method, ms, context) {
	this.id = _Tools.genId()
	this.method = method
	this.ms = ms
	this.context = context
	this.time = 0
}

function TimeMapBuffer (subscriber) {
	this.id = _Tools.genId()
	this.method = subscriber.method
	this.context = subscriber.context
}

function Interval (method, ms, context) {
	this.startDate = new Date().getTime()
	this.pauseDate = null
	this.context = context
	this.method = function () {
		method.call(this.context)
	}
	this.pause = function () {
		clearInterval(this.handle)
		this.pauseDate = new Date().getTime()
	}
	this.continue = function () {
		var time = this.ms - (this.pauseDate - this.startDate)
		setTimeout(function () {
			this.method.call(this.context)
			this.handle = setInterval(this.method.bind(this), ms)
		}.bind(this), time)
	}
	this.ms = ms
	this.handle = setInterval(this.method.bind(this), ms)
}

function Timeout (id, method, ms, context) {
	this.id = id
	this.startDate = new Date().getTime()
	this.pauseDate = null
	this.context = context
	this.method = function () {
		method.call(this.context)
		for (var i = 0; i < _Data.timeouts.length; i++ ) {
			if (_Data.timeouts[i].id == this.id) {
				_Data.timeouts.splice(i, 1)
				break
			}
		}
	}
	this.pause = function () {
		clearTimeout(this.handle)
		this.pauseDate = new Date().getTime()
	}
	this.continue = function () {
		var time = this.ms - (this.pauseDate - this.startDate)
		this.handle = setTimeout(function () {
			this.method()
		}.bind(this), time)
	}
	this.ms = ms
	this.handle = setTimeout(this.method.bind(this), ms)
}

function RenderBuffer (name, method) {
	this.__proto__.enable = _Tools.enableBuffer
	this.__proto__.disable = _Tools.disableBuffer
	this.id = _Tools.genId()
	this.context = gl
	this.name = name
	this.method = method
	this.activated = false
}

function IntervalBuffer (name, method, ms) {
	this.__proto__.enable = _Tools.enableBuffer
	this.__proto__.disable = _Tools.disableBuffer
	this.id = _Tools.genId()
	this.context = gl
	this.name = name
	this.method = method
	this.activated = false
}

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
	this.id = _Tools.genId()
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
	this.id = _Tools.genId()
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
	this.id = _Tools.genId()
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
		this.gridLink.graphObject.block = this.states[this.curState].block
		this.gridLink.name = this.states[this.curState].name
		this.gridLink.symbol = this.states[this.curState].symbol
	}
}

var Cell__proto__ = {
	setObject: function (name, symbol, category) {
		this.object = $.extend(true, {}, MapObjects[name])
		if (category) {
			var item = MapObjects.addItem(category, symbol, name, this.object)
			this.item = item
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
	this.id = _Tools.genId()
	this.name = name
	this.pos = context.pos;
	this.curFrame = 0;
	this.img = context.anim[name].img
	this.totalFrames = context.anim[name].frames.length;
	this.frames = context.anim[name].frames
	this.repeat = context.anim[name].repeat;
};

function LowLayerBuffer (img, getParams, speed, tFrames, ms) {
	this.__proto__.removeBuffer = function () {
		for (var i = 0; i < gl.lowLayer.length; i++) {
			if (this.id == gl.lowLayer[i].id) {
				gl.lowLayer.splice(i, 1)
				_Tools.clearInterval(this.handle)
				return
			}
		}
	}
	this.start = new Date().getTime()
	this.id = _Tools.genId()
	this.img = img
	this.picArr = []
	this.ms = ms
	this.tFrames = tFrames
	this.curFrame = 0
	this.getParams = getParams
	this.getParams()
	this.handle = _Tools.setInterval.call(this, function () {
		var date = new Date().getTime()
		if (date - this.start >= this.ms) {
			this.removeBuffer()
			return
		}
		this.getParams()
	}.bind(this), speed)
}

function HighLayerBuffer (img, getParams, speed, tFrames, ms) {
	this.__proto__.removeBuffer = function () {
		for (var i = 0; i < gl.highLayer.length; i++) {
			if (this.id == gl.highLayer[i].id) {
				gl.highLayer.splice(i, 1)
				_Tools.clearInterval(this.handle)
				return
			}
		}
	}
	this.start = new Date().getTime()
	this.id = _Tools.genId()
	this.img = img
	this.picArr = []
	this.ms = ms
	this.tFrames = tFrames
	this.curFrame = 0
	this.getParams = getParams
	this.getParams()
	this.handle = _Tools.setInterval.call(this, function () {
		var date = new Date().getTime()
		if (date - this.start >= this.ms) {
			this.removeBuffer()
			return
		}
		this.getParams()
	}.bind(this), speed)
}

function Message (place, ms, getText) {
	this.place = place
	this.getText = getText
	this.ms = ms
	messageBuffer = null
}

function MessageBuffer (getText, color, size, baseLine, textAlign, bold, getPos, offsetY, type) {
	this.id = _Tools.genId()
	this.getText = getText
	this.color = color
	this.size = size
	this.bold = bold
	this.baseLine = baseLine
	this.textAlign = textAlign
	this.offsetY = offsetY
	this.type = type
	this.getPos = getPos
}

function OutputTextBuffer (getText, color, size, baseLine, textAlign, bold, getPos, type) {
	this.id = _Tools.genId()
	this.getText = getText
	this.color = color
	this.size = size
	this.bold = bold
	this.baseLine = baseLine
	this.textAlign = textAlign
	this.type = type
	this.getPos = getPos
}

function OutputImageBuffer (type, img, imgX, imgY, imgW, imgH, getPos, w, h, repeat) {
	this.id = _Tools.genId()
	this.type = type
	this.img = img
	this.imgX = imgX
	this.imgY = imgY
	this.imgW = imgW
	this.imgH = imgH
	this.getPos = getPos
	this.w = w
	this.h = h
	this.repeat = repeat
}

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

function Effect (particles, x, y, img) {
	this.id = _Tools.genId()
	this.img = img
	this.particles = particles
	this.color = color.red
	this.x = x
	this.y = y
	this.delay = 5
	this.intervalId = null
}

function _Player () {
	this.id = 4
	this.pos = {x: 0, y: 0}
	this.mPos = {
		x: 0,
		y: 0
	}
	this.handle = null
	this.curAction = null
	this.speed = 9
	this.anim = Anim.lib.pacman
	this.animationBuffer = null
	this.isDead = function () {
		this.stop();
		this.changeAnimation("dead")
		_Data.status = "playerIsDead"
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
	this.mPos = {
		x: 0,
		y: 0
	}
	this.handle = null
	this.anim = anim
	this.animationBuffer = null
	this.curAction = 0
	this.speed = 10
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
		this.curAction = null
		this.path = []
		this.pointPos = {x: this.default.pos.x / 32,
						 y: this.default.pos.y / 32}
		this.changeAnimation('default')
		if (this.default.behavior == "inRoom") {
			Room.list.push(this)
		}
	}
}

function Character () {
	this.left = function () {
		this.mPos.x = -1;
		this.mPos.y = 0;
		this.curAction = 0;
		if (this.id != 4 && this.behavior == "goToRoom" ||
			this.id != 4 && this.behavior == "enterToRoom") {
			if (this.animationBuffer.name != 'eyesLeft') {
				this.changeAnimation("eyesLeft")
			} else if (this.id != 4 && this.behavior == "fear") {
				this.changeAnimation("fearLeft")
			}
			return
		} else if (this.id != 4 && this.behavior == "fear") {
			if (this.animationBuffer.name != 'fearLeft') {
				this.changeAnimation("fearLeft")
			}
			return
		} else if (this.id != 4 && this.behavior == "fearPreTimeout") {
			if (this.animationBuffer.name != 'fearPreTimeoutLeft') {
				this.changeAnimation("fearPreTimeoutLeft")
			}
			return
		}
		if (this.animationBuffer == null || this.animationBuffer.name != 'left') {
			this.changeAnimation("left")
		}
	}
	this.right = function () {
		this.mPos.x = 1;
		this.mPos.y = 0;
		this.curAction = 2;
		if (this.id != 4 && this.behavior == "goToRoom" ||
			this.id != 4 && this.behavior == "enterToRoom") {
			if (this.animationBuffer.name != 'eyesRight') {
				this.changeAnimation("eyesRight")
			} else if (this.id != 4 && this.behavior == "fear") {
				this.changeAnimation("fearRight")
			}
			return
		} else if (this.id != 4 && this.behavior == "fear") {
			if (this.animationBuffer.name != 'fearRight') {
				this.changeAnimation("fearRight")
			}
			return
		} else if (this.id != 4 && this.behavior == "fearPreTimeout") {
			if (this.animationBuffer.name != 'fearPreTimeoutRight') {
				this.changeAnimation("fearPreTimeoutRight")
			}
			return
		}
		if (this.animationBuffer == null || this.animationBuffer.name != 'right') {
			this.changeAnimation("right")
		}
	}
	this.up = function () {
		this.mPos.x = 0;
		this.mPos.y = -1;
		this.curAction = 1;
		if (this.id != 4 && this.behavior == "goToRoom" ||
			this.id != 4 && this.behavior == "enterToRoom") {
			if (this.animationBuffer.name != 'eyesUp') {
				this.changeAnimation("eyesUp")
			} else if (this.id != 4 && this.behavior == "fear") {
				this.changeAnimation("fearUp")
			}
			return
		} else if (this.id != 4 && this.behavior == "fear") {
			if (this.animationBuffer.name != 'fearUp') {
				this.changeAnimation("fearUp")
			}
			return
		} else if (this.id != 4 && this.behavior == "fearPreTimeout") {
			if (this.animationBuffer.name != 'fearPreTimeoutUp') {
				this.changeAnimation("fearPreTimeoutUp")
			}
			return
		}
		if (this.animationBuffer == null || this.animationBuffer.name != 'up') {
			this.changeAnimation("up")
		}
	}
	this.down = function () {
		this.mPos.x = 0;
		this.mPos.y = 1;
		this.curAction = 3;
		if (this.id != 4 && this.behavior == "goToRoom" ||
			this.id != 4 && this.behavior == "enterToRoom") {
			if (this.animationBuffer.name != 'eyesDown') {
				this.changeAnimation("eyesDown")
			}
			return
		} else if (this.id != 4 && this.behavior == "fear") {
			if (this.animationBuffer.name != 'fearDown') {
				this.changeAnimation("fearDown")
			}
			return
		} else if (this.id != 4 && this.behavior == "fearPreTimeout") {
			if (this.animationBuffer.name != 'fearPreTimeoutDown') {
				this.changeAnimation("fearPreTimeoutDown")
			}
			return
		}
		if (this.animationBuffer == null || this.animationBuffer.name != 'down') {
			this.changeAnimation("down")
		}
	}
	this.stop = function () {
		this.mPos.x = 0;
		this.mPos.y = 0;
		this.curAction = 4
		if (this.id != 4 && this.behavior == 'goToRoom' ||
			this.id != 4 && this.behavior == 'enterToRoom' ||
			this.id != 4 && this.behavior == 'shocked') {
			return
		}
		if (this.id != 4 && this.animationBuffer.name != 'default') {
			this.changeAnimation('default')
		}
	}
	this.changeAnimation = function (name) {
		Anim.removeAnimationBuffer(this.animationBuffer)
		Anim.addAnimationBuffer(this, name)
	}
}

function AIPrototype () {
	this.setFearPreTimeoutImg = function () {
		this.img = Imgs.fear_pre_timeout;
	};
	this.enterToRoom = function () {
		if (this.behavior == "goToRoom") {
			Room.enter.call(this)
		}
	}
	this.goToRoom = function () {
		Room.goToRoom.call(this)
	};
	this.exitFromRoom = function () {
		if (this.behavior == "inRoom") {
			Room.exit.call(this)
		}
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
