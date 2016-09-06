
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

var StaticObjects = {
	array: [],
	addObject: function (name, object, block, symbol) {
		this[name] = new StaticObject(name, object, block, symbol)
		this.array.push(this[name])
		ComparitionSymbols[symbol] = this[name]
		Objects[name] = this[name]
	},
	init: function () {
		this.addObject('empty', Blocks.getBlock('empty'), false, "e")
		this.addObject('wall',  Blocks.getBlock('wall'),  true,  "w")
	}
}
var DynamicObjects = {
	array: [],
	addObject: function (name, object, block, symbol) {
		this[name] = new DynamicObject(name, object, block, symbol)
		this.array.push(this[name])
		ComparitionSymbols[symbol] = this[name]
		Objects[name] = this[name]
	},
	init: function () {
		this.addObject('food',      Blocks.getBlock('food'),      false,  "f")
		this.addObject('energiser', Blocks.getBlock('energiser'), false,  "g")
		this.addObject('door',      Blocks.getBlock('door'),      true,   "d")
	}
}

/*var Dynamic_blocks = {
	array: [],
	add_block: function (name, pic, pos, block, id, in_map) {
		if (!(name in this)) {
			this[name] = []
		}
		in_map.forEach(function (cord) {
			var new_block = new Block(name, pic, pos, block, id, cord, 'dynamic')
			Dynamic_blocks[name].push(new_block)
			Dynamic_blocks.array.push(new_block)
		})
	},
	get_default: function () {
		this.array.forEach(function (block) {
			delete Dynamic_blocks[block.name]
		})

		this.array = [];
	}
}*/

var EventBlocks = {
	array: [],
	add_block: function (name, pic, pos) {
		var new_block = new Buf_event(name, pic, pos)
		this[name] = new_block
		this.array.push(new_block)
	},
	getBlock: function (name) {
		return this[name]
	},
	set_default: function () {
		this.array.forEach(function (block) {
			delete Dynamic_blocks[block.name]
		})
		this.add_block('x2', Imgs.event, {x: 0, y: 0})
		this.add_block('x3', Imgs.event, {x: 0, y: 32})
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
	go: function () {
		this.point_pos = {
			x: 10,
			y: 7
		}
		this.img = Imgs.go_to_room;
		b_Controller.set_go_to_room.call(this)
	},
	reposition: function () {
		Room.list.forEach(function (enemy, i) {
			enemy.point_pos = Room.position[i];
		});
	},
	enter: function () {
		if (Room.list.length == 3) {
			Room.exit.call(Room.list[0])
		}
		Room.list.push(this);
		Room.reposition()
		this.set_original_img();
		b_Controller.set_enter_to_room.call(this);
	},
	exit: function () {
		this.point_pos = {
			x: 10,
			y: 7
		}
		b_Controller.set_exit_from_room.call(this)
		Room.list.splice(0, 1);
		Room.reposition()
	}
};