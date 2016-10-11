var Col = {
	check: function (offset) {
		/*if (this.id != 4 && this.shocked) {
			return true
		}*/

		var newPos = {};
		newPos.x = this.pos.x + this.mPos.x;
		newPos.y = this.pos.y + this.mPos.y;


		if (offset != undefined) {
			newPos.x += offset.x;
			newPos.y += offset.y;
		};
		//Portal
		if (newPos.x < 0 || newPos.x + 32 > 672) {
			return false
		};

		var x = Math.floor(newPos.x / 32);
		var y = Math.floor(newPos.y / 32);
		var width = Math.floor((newPos.x + 31) / 32);
		var height = Math.floor((newPos.y + 31) / 32);
		
		if (_Map.grid[x][y].object.block ||
			_Map.grid[width][height].object.block ||
			_Map.grid[width][y].object.block ||
			_Map.grid[x][height].object.block) {
			return true;
		} else {
			return false;
		};
	},
	offsetCheck: function () {
		/*if (this.id != 4 && this.shocked) {
			return false
		}*/
		var offset = {};
		if (this.mPos.y != 0) {
			offset.y = 0;
			for (var x = -20; x <= 20; x++) {
				//Portal
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
		if (this.mPos.x != 0) {
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
	checkCell: function () {
		if (this.pos.x < 0 ||
				this.pos.x > 640) {
			return false
		};
		var x = Math.floor((this.pos.x + 16) / 32);
		var y = Math.floor((this.pos.y + 16) / 32);

		if (_Map.grid[x][y].object.type == 'dynamic') {
			return _Map.grid[x][y]
		} else {
			return false
		}
		/*if (id != 0) {
			if (id == 2) {
				Sounds.step.play()
				_Map.grid[x][y].make_empty();
				Scope.points += 1;
				if (Event.buf_event_active) {
					Scope.main += 20 * Event.buf_event_action;
				} else {
					Scope.main += 20
				};
				Scope.check_end_game();
			};
			if (id == 4) {
				_Map.grid[x][y].make_empty();
				if (Event.buf_event_active) {
					Scope.main += 50 * Event.buf_event_action;
				} else {
					Scope.main += 50
				};
				Col.bitch_check()
				Event.start();
			};
		};*/
	},
	checkEnemy: function () {
		for (var i = 0; i < enemyArr.length; i++) {
			if (this.pos.x + 16 > enemyArr[i].pos.x &&
					this.pos.x + 16 < enemyArr[i].pos.x + 32 &&
					this.pos.y + 16 > enemyArr[i].pos.y &&
					this.pos.y + 16 < enemyArr[i].pos.y + 32) {
				return enemyArr[i];
			};
		};
		return false;
	},
	checkPlayer: function () {
		if (this.pos.x + 16 > Player.pos.x &&
				this.pos.x + 16 < Player.pos.x + 32 &&
				this.pos.y + 16 > Player.pos.y &&
				this.pos.y + 16 < Player.pos.y + 32) {
			return true;
		};
	},
	doorFix: function () {
		for (var i = 0; i < enemyArr.length; i++) {
			if (Math.floor(enemyArr[i].pos.x / 32) == 10 &&
				Math.floor(enemyArr[i].pos.y / 32) == 8 ||
				Math.floor((enemyArr[i].pos.x + 31) / 32) == 10 &&
				Math.floor((enemyArr[i].pos.y + 31) / 32) == 8) {
				return false
			}
		}
		return true
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
	enemyInLine: function () {
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

		var enemyPos = enemyArr.map(function (enemy) {
			var pos = {
				id: enemy.id,
				x: Math.floor(enemy.pos.x / 32),
				y: Math.floor(enemy.pos.y / 32)
			}
			return pos
		})

		do {

			for (var i = 0; i < enemyPos.length; i++) {
				if (enemyPos[i].x == x && enemyPos[i].y == y && enemyArr[enemyPos[i].id].behavior != 'grab' && enemyArr[enemyPos[i].id].behavior != 'goToRoom') {
					return enemyArr[enemyPos[i].id]
				};
			}
			x += direction.x
			y += direction.y
			if (x < 0 || x > 20) {
				return false
			}
		}
		while (!_Map.grid[x][y].object.block)
		return false
	},
	missCheck: function () {
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
	},
	check_event: function () {
		var x = this.pos.x
		var y = this.pos.y
		var w = this.pos.x + 31
		var h = this.pos.y + 31
		if (
			Event.buf_event_pos.x > x &&
			Event.buf_event_pos.x < w &&
			Event.buf_event_pos.y > y &&
			Event.buf_event_pos.y < h 
			) {
			Event.buf_event_taked()
		};
	}
};