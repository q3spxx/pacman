var Col = {
	check: function (offset) {
		var new_pos = {};
		new_pos.x = this.pos.x + this.m_pos.x;
		new_pos.y = this.pos.y + this.m_pos.y;

		if (new_pos.x < 0 ||
				new_pos.x > 640) {
			return false
		};

		if (offset != undefined) {
			new_pos.x += offset.x;
			new_pos.y += offset.y;
		};

		var x = Math.floor(new_pos.x / 32);
		var y = Math.floor(new_pos.y / 32);
		var width = Math.floor((new_pos.x + 31) / 32);
		var height = Math.floor((new_pos.y + 31) / 32);

		if (Map.grid[x][y].block ||
				Map.grid[width][height].block ||
				Map.grid[width][y].block ||
				Map.grid[x][height].block) {
			return true;
		} else {
			return false;
		};
	},
	offset_check: function () {
		var offset = {};
		if (this.m_pos.y != 0) {
			offset.y = 0;
			for (var x = -24; x <= 24; x++) {
				offset.x = x;
				if (Col.check.call(this, offset) == false) {
					return offset;
				};
			};
		};
		offset.x = 0;
		if (this.m_pos.x != 0) {
			offset.x = 0;
			for (var y = -24; y <= 24; y++) {
				offset.y = y;
				if (Col.check.call(this, offset) == false) {
					return offset
				};
			};
		};
		offset.y = 0;
		return false;
	},
	check_item: function () {
		if (this.pos.x < 0 ||
				this.pos.x > 640) {
			return;
		};
		var x = Math.floor((this.pos.x + 16) / 32);
		var y = Math.floor((this.pos.y + 16) / 32);
		var type = Map.grid[x][y].type;
		if (type != 0) {
			if (type == 2) {
				Sounds.step.play()
				Map.grid[x][y].makeEmpty();
				Scope.points += 1;
				Scope.main += 20;
				Scope.check_end_game();
			};
			if (type == 4) {
				Map.grid[x][y].makeEmpty();
				Scope.main += 50;
				Event.start();
			};
		};
	},
	check_enemy: function () {
		for (var i = 0; i < enemy_arr.length; i++) {
			if (this.pos.x + 16 > enemy_arr[i].pos.x &&
					this.pos.x + 16 < enemy_arr[i].pos.x + 32 &&
					this.pos.y + 16 > enemy_arr[i].pos.y &&
					this.pos.y + 16 < enemy_arr[i].pos.y + 32) {
				return enemy_arr[i];
			};
		};
		return false;
	},
	check_player: function () {
		if (this.pos.x + 16 > Player.pos.x &&
				this.pos.x + 16 < Player.pos.x + 32 &&
				this.pos.y + 16 > Player.pos.y &&
				this.pos.y + 16 < Player.pos.y + 32) {
			return true;
		};
	},
	special_check: function () {
		var x = Math.floor((this.x + this.w) / 32);
		var y = Math.floor((this.y + this.h) / 32);
		var w = Math.floor((this.x + this.w + this.img.w) / 32);
		var h = Math.floor((this.y + this.h + this.img.h) / 32);

		if (
			w > 20 && y == 9 ||
			x < 0 && y == 9
			) {
			return true;
		};

		if (
			Map.grid[x][y].block ||
			Map.grid[x][h].block ||
			Map.grid[w][y].block ||
			Map.grid[w][h].block
			) {
			return true;
		};
		return false;
	},
	special_check_enemy: function () {
		var x = Math.floor(this.x + this.w - 4 + this.img.w / 2);
		var y = Math.floor(this.y + this.h - 4 + this.img.h / 2);

		for (var i = 0; i < enemy_arr.length; i++) {
			if (
				x > enemy_arr[i].pos.x + 12 &&
				x < enemy_arr[i].pos.x + 20 &&
				y > enemy_arr[i].pos.y + 12 &&
				y < enemy_arr[i].pos.y + 20 
				) {
				return enemy_arr[i];
			};
		};
		return false
	}
};