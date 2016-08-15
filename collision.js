var Col = {
	check: function (offset) {
		if (this.id != 4 && this.shocked) {
			return true
		}

		var new_pos = {};
		new_pos.x = this.pos.x + this.m_pos.x;
		new_pos.y = this.pos.y + this.m_pos.y;


		if (offset != undefined) {
			new_pos.x += offset.x;
			new_pos.y += offset.y;
		};

		if (new_pos.x < 0 || new_pos.x + 32 > 672) {
			return false
		};

		var x = Math.floor(new_pos.x / 32);
		var y = Math.floor(new_pos.y / 32);
		var width = Math.floor((new_pos.x + 31) / 32);
		var height = Math.floor((new_pos.y + 31) / 32);
		
		if (_Map.grid[x][y].block ||
				_Map.grid[width][height].block ||
				_Map.grid[width][y].block ||
				_Map.grid[x][height].block) {
			return true;
		} else {
			return false;
		};
	},
	offset_check: function () {
		if (this.id != 4 && this.shocked) {
			return false
		}
		var offset = {};
		if (this.m_pos.y != 0) {
			offset.y = 0;
			for (var x = -20; x <= 20; x++) {
				if (this.pos.x + x < 0 || this.pos.x + x > 640) {
					return false
				};
				offset.x = x;
				if (Col.check.call(this, offset) == false) {
					return offset;
				};
			};
		};
		offset.x = 0;
		if (this.m_pos.x != 0) {
			offset.x = 0;
			for (var y = -20; y <= 20; y++) {
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
		var id = _Map.grid[x][y].id;
		if (id != 0) {
			if (id == 2) {
				Sounds.step.play()
				_Map.grid[x][y].make_empty();
				Scope.points += 1;
				Scope.main += 20;
				Scope.check_end_game();
			};
			if (id == 4) {
				_Map.grid[x][y].make_empty();
				Scope.main += 50;
				Col.bitch_check()
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
			_Map.grid[x][y].block ||
			_Map.grid[x][h].block ||
			_Map.grid[w][y].block ||
			_Map.grid[w][h].block
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
	},
	bomb_check: function () {
		var r_x = Player.pos.x + 16;
		var r_y = Player.pos.y + 16;

		enemy_arr.forEach(function (enemy) {
			if (Col.hypotenuse(enemy.pos.x, enemy.pos.y, r_x, r_y, Special.bomb.radius)) {
				Controller.kill_enemy(enemy);
				return
			}
			if (Col.hypotenuse(enemy.pos.x + 32, enemy.pos.y, r_x, r_y, Special.bomb.radius)) {
				Controller.kill_enemy(enemy);
				return
			}
			if (Col.hypotenuse(enemy.pos.x, enemy.pos.y + 32, r_x, r_y, Special.bomb.radius)) {
				Controller.kill_enemy(enemy);
				return
			}
			if (Col.hypotenuse(enemy.pos.x + 32, enemy.pos.y + 32, r_x, r_y, Special.bomb.radius)) {
				Controller.kill_enemy(enemy);
				return
			}
		});
	},
	bitch_check: function () {
		var r_x = Player.pos.x + 16;
		var r_y = Player.pos.y + 16;
		var radius = 48

		enemy_arr.forEach(function (enemy) {
			if (Col.hypotenuse(enemy.pos.x, enemy.pos.y, r_x, r_y, radius) && enemy.behavior == 'chase') {
				Sounds.bitch.play()
				return
			}
			if (Col.hypotenuse(enemy.pos.x + 32, enemy.pos.y, r_x, r_y, radius && enemy.behavior == 'chase')) {
				Sounds.bitch.play()
				return
			}
			if (Col.hypotenuse(enemy.pos.x, enemy.pos.y + 32, r_x, r_y, radius && enemy.behavior == 'chase')) {
				Sounds.bitch.play()
				return
			}
			if (Col.hypotenuse(enemy.pos.x + 32, enemy.pos.y + 32, r_x, r_y, radius && enemy.behavior == 'chase')) {
				Sounds.bitch.play()
				return
			}
		});
	},
	hypotenuse: function (x, y, r_x, r_y, radius) {
		var hypotenuse = Math.sqrt(Math.pow(r_x - x, 2) + Math.pow(r_y - y, 2))
		if (hypotenuse < radius) {
			return true
		} else {
			return false
		}
	},
	enemy_in_line_check: function () {
		var x = Math.floor(Player.pos.x / 32)
		var y = Math.floor(Player.pos.y / 32)

		var direction;

		switch (Player.curAction) {
			case 0: direction = {x: -1, y: 0}
			break 
			case 1: direction = {x: 0, y: -1}
			break 
			case 2: direction = {x: 1, y: 0}
			break 
			case 3: direction = {x: 0, y: 1}
			break 
		}

		var enemy_pos = enemy_arr.map(function (enemy) {
			var pos = {
				id: enemy.id,
				x: Math.floor(enemy.pos.x / 32),
				y: Math.floor(enemy.pos.y / 32)
			}
			return pos
		})


		do {

			for (var i = 0; i < enemy_pos.length; i++) {
				if (enemy_pos[i].x == x && enemy_pos[i].y == y && enemy_arr[enemy_pos[i].id].behavior != 'grab' && enemy_arr[enemy_pos[i].id].behavior != 'go_to_room') {
					return enemy_arr[enemy_pos[i].id]
				};
			}
			x += direction.x
			y += direction.y
			if (x < 0 || x > 20) {
				return false
			}
		}
		while (!_Map.grid[x][y].block)
		return false
	},
	miss_check: function () {
		var random = Math.floor(Math.random() * 100)
		if (Special.shot.chanse() > random) {
			return true
		} else {
			return false
		}
	},
	shock_enemy_check: function () {
		for (var i = 0; i < enemy_arr.length; i++) {
			if (this.x < enemy_arr[i].pos.x + 16 &&
				this.x + 31 > enemy_arr[i].pos.x + 16 &&
				this.y < enemy_arr[i].pos.y + 16 &&
				this.y + 31 > enemy_arr[i].pos.y + 16 &&
				enemy_arr[i].behavior != 'go_to_room' &&
				enemy_arr[i].behavior != 'grab') {
				return enemy_arr[i]
			}
		}
		return false
	},
	shock_check: function () {
		var x = Math.floor(this.x / 32)
		var y = Math.floor(this.y / 32)
		var w = Math.floor((this.x + 31) / 32)
		var h = Math.floor((this.y + 31) / 32)
		if (x < 0 || w > 20) {
			return true
		}
		if (_Map.grid[x][y].block ||
			_Map.grid[w][y].block ||
			_Map.grid[x][h].block ||
			_Map.grid[w][h].block
			) {
			return true
		}
		return false
	}
};