var Static_blocks = {
	array: [],
	add_block: function (name, pic, pos, block, id, in_map) {
		this[name] = new Block(name, pic, pos, block, id, in_map, 'static')
		this.array.push(this[name])
	},
	get_default: function () {
		this.array.forEach(function (block) {
			delete Static_blocks[block.name]
		})

		this.array = [];

		this.add_block('empty', Imgs.map, {x: 0, y: 0}, false, 0, blocks_pos.get_empty_pos())
		this.add_block('wall', Imgs.map, {x: 32, y: 0}, true, 1, blocks_pos.get_wall_pos())
		this.add_block('food', Imgs.map, {x: 64, y: 0}, false, 2, blocks_pos.get_food_pos())
		this.add_block('energiser', Imgs.map, {x: 128, y: 0}, false, 4, blocks_pos.get_energiser_pos())
	}
}

var Dynamic_blocks = {
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
		this.add_block('door', Imgs.map, {x: 96, y: 0}, true, 3, blocks_pos.get_door_pos())
	}
}

var Event_blocks = {
	array: [],
	add_block: function (name, pic, pos, y) {
		var new_block = new Buf_event(name, pic, pos, y)
		this[name] = new_block
		this.array.push(new_block)
	},
	get_default: function () {
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