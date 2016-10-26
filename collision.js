var Col = {
	check: function (offset) {

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
	checkPlayerInline:function (x, y, vec) {
		do {
			x += vec.x
			y += vec.y
			if (x < 0 || x > 20) {
				return false
			}
			if (
				Player.pos.x + 16 > x * 32 &&
				Player.pos.x + 16 < x * 32 + 31 &&
				Player.pos.y + 16 > y * 32 &&
				Player.pos.y + 16 < y * 32 + 31
				) {
				return true
			}
		}
		while(!_Map.grid[x][y].object.block)
		return false
	},
	offsetCheck: function () {
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
	hypotenuse: function (x, y, rX, rY, radius) {
		var hypotenuse = Math.sqrt(Math.pow(rX - x, 2) + Math.pow(rY - y, 2))
		if (hypotenuse < radius) {
			return true
		} else {
			return false
		}
	},
	enemyInLine: function () {
		var x = Math.floor(Player.pos.x / 32)
		var y = Math.floor(Player.pos.y / 32)
		var arr = []

		var direction;

		switch (Special.shot.direction) {
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
					if (Events.gain.quaddamage) {
						arr.push(enemyArr[enemyPos[i].id])
					} else {
						arr.push(enemyArr[enemyPos[i].id])
						return arr
					}
				};
			}
			x += direction.x
			y += direction.y
			if (x < 0 || x > 20) {
				return false
			}
		}
		while (!_Map.grid[x][y].object.block)
		if (arr.length > 0) {
			return arr
		}
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
	checkGain: function () {
		var x = this.pos.x
		var y = this.pos.y
		var w = this.pos.x + 31
		var h = this.pos.y + 31
		if (
			Events.gain.pos.x + 16 > x &&
			Events.gain.pos.x + 16 < w &&
			Events.gain.pos.y + 16 > y &&
			Events.gain.pos.y + 16 < h 
			) {
			return true
		};
		return false
	}
};