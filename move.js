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

		//Portal
		if (this.pos.x < 0) {
			this.pos.x = 640;
		} else if (this.pos.x > 640) {
			this.pos.x = 0;
		};

		if (this.id != 4) {
			var res = Col.check_player.call(this);
			if (res) {
				if (Event.status == 0 &&
					_data.status != 'special' &&
					this.behavior != 'go_to_room' &&
					this.behavior != 'enter_to_room' &&
					this.behavior != 'exit_from_room' &&
					this.behavior != 'in_room'
					) {
					Controller.game_pause();
					Player.is_dead();
					Sounds.dead.play()
					_data.lifes -= 1;
					_data.total_kills = 0
					Sounds.signal.pause();
					Sounds.signal.currentTime = 0;
					if (_data.lifes == 0) {
						_data.set_center_mess('Game over')
						clearTimeout(Event.random_event_handle)
						_data.center_mess_switch = true;
						clearTimeout(Event.buf_event_handle)
						clearTimeout(Event.buf_event_active_handle)
						clearInterval(Event.buf_event_timer_handle)
						Event.buf_event_default()
						
						console.log("Game over");
					} else {
						_data.reinit_level();
					};
				};
			};
		};
		if (this.id == 4) {
			Col.check_item.call(this);
			if (Event.buf_event) {
				Col.check_event.call(this)
			};
			if (Event.status == 1) {
				var enemy = Col.check_enemy.call(this);
				if (enemy != false) {
					Controller.kill_enemy(enemy);
				};
			};
		};
		return true;
	},
	ai_arrows: function () {
		//действия при окончании пути
		if (this.path.length == 0) {
			this.stop();
			// при чейзе подгон положения под игрока
			if (this.behavior == 'chase') {
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
			} else if (this.behavior == "enter_to_room") {
				close_door();
				b_Controller.set_in_room.call(this);
			} else if (this.behavior == "exit_from_room") {
				close_door();
				if (Event.status == 1) {
					if (Event.timeout) {
						this.set_fear_pre_timeout_img()
					} else {
						this.set_fear_img();
					}
					b_Controller.set_fear.call(this)
				} else {
					b_Controller.set_passive.call(this);
				};
			} else if (this.behavior == 'go_to_room') {
				Room.enter.call(this)
			};
			return;
		};
		//Удаление достигнутой точки
		if (this.pos.x == this.path[0].x * 32 && this.pos.y == this.path[0].y * 32) {
			this.path.splice(0, 1);
		};
		//фикс двери
		if (this.behavior != 'enter_to_room' && this.behavior != 'exit_from_room') {
				if (this.path[0] != undefined) {
					if (this.path[0].x == 10 && this.path[0].y == 8) {
						this.path = [];
					};
				};
		};
		//Остановка после достижения конечной точки
		if (this.path.length == 0) {
			this.stop();
			return;
		};

		if (this.behavior == "enter_to_room" || this.behavior == "exit_from_room") {
			if (this.path[0].x == 10 && this.path[0].y == 8) {
				open_door();
			}
		}

		if (this.pos.x == this.path[0].x * 32) {
			if (this.pos.y > this.path[0].y * 32) {
				this.up()
			} else {
				this.down()
			};
		};
		if (this.pos.y == this.path[0].y * 32) {
			if (this.pos.x > this.path[0].x * 32) {
				this.left();
			} else {
				this.right();
			};
		}
		//portal
		if (this.pos.x / 32 == 0 && this.path[0].x == 20) {
			this.left();
		} else if (this.pos.x / 32 == 20 && this.path[0].x == 0) {
			this.right()
		};
		// проверка видимости цели
		if (this.behavior == "passive") {
			var res = b_Controller.check_visibility.call(this);
			if (res) {
				b_Controller.set_chase.call(this);
			};
		};
	}
};