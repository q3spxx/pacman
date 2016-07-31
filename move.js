var Move = {
	set: function () {
		if (Col.check.call(this)) {
			var offset_check = Col.offset_check.call(this);
			if (offset_check != false) {
				this.pos.x += offset_check.x;
				this.pos.y += offset_check.y;
			} else {
				return false;
			};
		};
		this.pos.x += this.m_pos.x;
		this.pos.y += this.m_pos.y;
		if (this.pos.x <= -32) {
			this.pos.x = 640;
		} else if (this.pos.x >= 671) {
			this.pos.x = 0;
		};
		if (this.id != 4) {
			var res = Col.check_player.call(this);
			if (res) {
				if (Event.status == 0) {
					console.log("Game over");
				};
			};
		};
		if (this.id == 4) {
			Col.check_item.call(this);
			if (Event.status == 1) {
				var enemy = Col.check_enemy.call(this);
				if (enemy != false) {
					Anim.show_mess("200", {x: enemy.pos.x, y: enemy.pos.y}, 18, color['white'], 0);
					Scope.main += 200;
					enemy.go_to_room();
				};
			};
		};
		return true;
	},
	ai_arrows: function () {
		if (this.path.length == 0) {
			this.m_pos.x = 0;
			this.m_pos.y = 0;
			if (this.behavior == 0) {
				if (Player.pos.x != this.pos.x ||
						Player.pos.y != this.pos.y) {
					var x = Player.pos.x - this.pos.x;
					var y = Player.pos.y - this.pos.y;
					if (x < 0) {
						this.m_pos.x = -1;
						this.curAction = 0;
					} else if (x > 0) {
						this.m_pos.x = 1;
						this.curAction = 2;
					};
					if (y < 0) {
						this.m_pos.y = -1;
						this.curAction = 1;
					} else if (y > 0) {
						this.m_pos.y = 1;
						this.curAction = 3;
					};
				};
			} else if (this.behavior == 5) {
				close_door();
				if (Event.status != 0) {
					this.img = imgs[6];
					b_Controller.set_fear.call(this);
					return;
				};
				b_Controller.set_passive.call(this);
			};
			return;
		};
		if (this.pos.x == this.path[0].x * 32 && this.pos.y == this.path[0].y * 32) {
			this.path.splice(0, 1);
		};
		if (this.path.length != 0 && this.behavior != 4 && this.behavior != 5) {
				if (this.path[0].x == 10 && this.path[0].y == 8) {
					this.path = [];
				};
		};
		if (this.path.length == 0) {
			this.m_pos.x = 0;
			this.m_pos.y = 0;
			return;
		};
		if (this.pos.x == this.path[0].x * 32) {
			this.m_pos.x = 0;
			if (this.pos.y > this.path[0].y * 32) {
				this.m_pos.y = -1;
				this.curAction = 1;
			} else {
				this.m_pos.y = 1;
				this.curAction = 3;
			};
		};
		if (this.pos.y == this.path[0].y * 32) {
			this.m_pos.y = 0;
			if (this.pos.x > this.path[0].x * 32) {
				if (Math.abs(Math.floor(this.pos.x / 32) - this.path[0].x) > 1) {
					this.m_pos.x = 1;
					return;
				};
				this.m_pos.x = -1;
				this.curAction = 0;
			} else {
				if (Math.abs(Math.floor(this.pos.x / 32) - this.path[0].x) > 1) {
					this.m_pos.x = -1;
					return;
				};
				this.m_pos.x = 1;
				this.curAction = 2;
			};
		}

		if (this.behavior == 2) {
			var res = b_Controller.check_visibility.call(this);
			if (res) {
				b_Controller.set_chase.call(this);
			};
		};
	}
};