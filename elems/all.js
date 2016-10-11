
var ComparitionSymbols = {}
var Objects = {}
var Blocks = {
	array: [],
	addBlock: function (name, pic, pos) {
		this[name] = new Block(name, pic, pos)
		this.array.push(this[name])
	},
	getBlock: function (name) {
		return this[name]
	},
	setDefault: function () {
		this.array.forEach(function (block) {
			delete Blocks[block.name]
		})

		this.array = [];
		//            name         img       img pos
		this.addBlock('empty',     Imgs.map, {x: 0, y: 0})
		this.addBlock('wall',      Imgs.map, {x: 32, y: 0})
		this.addBlock('food',      Imgs.map, {x: 64, y: 0})
		this.addBlock('door',      Imgs.map, {x: 96, y: 0})
		this.addBlock('energiser', Imgs.map, {x: 128, y: 0})
	}
}

var MapObjects = {
	array: [],
	addObject: function (name, object, block, symbol, type) {
		this[name] = new MapObject(name, object, block, symbol, type)
		this.array.push(this[name])
		ComparitionSymbols[symbol] = name
		Objects[name] = this[name]
	},
	addCategory: function (name, states) {
		this[name] = new Category(states)
	},
	init: function () {
		this.addCategory('doors', [{name: 'door', symbol: 'd', image: 'door', block: true}, {name: 'empty', symbol: 'e',image: 'empty', block: false}])
		this.addCategory('foods', [{name: 'food', symbol: 'f', image: 'food', block: false}, {name: 'empty', symbol: 'e', image: 'empty', block: false}])
		this.addCategory('energisers', [{name: 'energiser', symbol: 'g', image: 'energiser', block: false}, {name: 'empty', symbol: 'e', image: 'empty', block: false}])
		this.addObject('empty',     Blocks.getBlock('empty'),     false,  "e", 'static')
		this.addObject('wall',      Blocks.getBlock('wall'),      true,   "w", 'static')
		this.addObject('food',      Blocks.getBlock('food'),      false,  "f", 'dynamic')
		this.addObject('energiser', Blocks.getBlock('energiser'), false,  "g", 'dynamic')
		this.addObject('door',      Blocks.getBlock('door'),      true,   "d", 'dynamic')
	},
	addItem: function (category, symbol, name, o) {
		this[category][symbol + this[category].id] = new Item(name, o, category)
		this[category].array.push(this[category][symbol + this[category].id])
		this[category].id++
		return this[category].array[this[category].array.length - 1]
	}
}

var EventBlocks = {
	array: [],
	addBlock: function (name, pic, pos) {
		var new_block = new Buf_event(name, pic, pos)
		this[name] = new_block
		this.array.push(new_block)
	},
	getBlock: function (name) {
		return this[name]
	},
	setDefault: function () {
		this.array.forEach(function (block) {
			delete Dynamic_blocks[block.name]
		})
		this.addBlock('x2', Imgs.event, {x: 0, y: 0})
		this.addBlock('x3', Imgs.event, {x: 0, y: 32})
	}

}

function open_door () {
	Dynamic_blocks.door[0].block = false;
	Dynamic_blocks.door[0].img.pos = {x: 0, y: 0};
};
function close_door () {
	for (var i = 0; i < enemy_arr.length; i++) {
		if (
			enemy_arr[i].pos.x >= 320 &&
			enemy_arr[i].pos.x < 352 && 
			enemy_arr[i].pos.y < 288 && 
			enemy_arr[i].pos.y >= 256 ||
			enemy_arr[i].pos.x >= 320 &&
			enemy_arr[i].pos.x < 352 && 
			enemy_arr[i].pos.y + 31 < 288 && 
			enemy_arr[i].pos.y + 31 >= 256
			) {
			return false
		}
	}

	Dynamic_blocks.door[0].block = true;
	Dynamic_blocks.door[0].img.pos = {x: 96, y: 0};
};

var Room = {
	handle: null,
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
	start: function () {
		this.handle = _Tools.setInterval.call(this, this.releaseEnemy.bind(this), 5000)
	},
	stop: function () {
		_Tools.clearInterval(this.handle)
		this.list = []
	},
	releaseEnemy: function () {
		if (this.list.length > 0) {
			this.list[0].exitFromRoom()
		}
	},
	goToRoom: function () {
		this.pointPos = {
			x: 10,
			y: 7
		}
		behaviorController.setGoToRoom.call(this)
	},
	reposition: function () {
		Room.list.forEach(function (enemy, i) {
			enemy.pointPos = Room.position[i];
		});
	},
	enter: function () {
		if (Room.list.length == 3) {
			Room.releaseEnemy()
		}
		Room.list.push(this);
		if (MapObjects.doors.d0.curState == 0) {
			MapObjects.doors.d0.changeState()
		}
		Room.reposition()
		behaviorController.setEnterToRoom.call(this);
	},
	exit: function () {
		this.pointPos = {
			x: 10,
			y: 7
		}
		behaviorController.setExitFromRoom.call(this)
		Room.list.splice(0, 1);
		if (MapObjects.doors.d0.curState == 0) {
			MapObjects.doors.d0.changeState()
		}
		Room.reposition()
	}
};