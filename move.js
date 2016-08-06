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
					Controller.game_pause();
					Player.is_dead();
					Sounds.dead.play()
					_data.lives -= 1;
					Sounds.signal.pause();
					Sounds.signal.currentTime = 0;
					if (_data.lives == 0) {
						console.log("Game over");
					} else {
						_data.reinit_level();
					};
				};
			};
		};
		if (this.id == 4) {
			Col.check_item.call(this);
			if (Event.status == 1) {
				var enemy = Col.check_enemy.call(this);
				if (enemy != false) {
					if (
						enemy.behavior == 'go_to_room' ||
						enemy.behavior == 'enter_to_room' ||
						enemy.behavior == 'exit_from_room' ||
						enemy.behavior == 'in_room'
						) {
						return
					}

					enemy.path = [];
					enemy.path[0] = {
						x: Math.floor(enemy.pos.x /32),
						y: Math.floor(enemy.pos.y /32)
					}

					Sounds.eatghost.play()
					if (_data.firstblood) {
						_data.firstblood = false;
						setTimeout(function () {
							Sounds.firstblood.play()
						}, 1000);
					};

					_data.kills += 1;

					if (_data.kill) {
						var say = false;

						switch (_data.kills) {
							case 2: say = Sounds.doublekill
							break
							case 3: say = Sounds.multikill
							break
							case 4: say = Sounds.megakill
							break
						}
						if (say != false) {						
							setTimeout(function () {
								say.play()
							}, 200);
						};
					};

					_data.kill_timer();

					Anim.show_mess(Math.pow(2, _data.kills) * 100, {x: enemy.pos.x, y: enemy.pos.y}, 18, color['white'], 0);
					Scope.main += Math.pow(2, _data.kills) * 100;
					enemy.go_to_room();
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
				console.log(this.behavior)
				Room.enter.call(this)
			};
			return;
		};
		//Удаление достигнутой точки
		if (this.pos.x == this.path[0].x * 32 && this.pos.y == this.path[0].y * 32) {
			this.path.splice(0, 1);
		};
		//фикс двери
		/*if (this.path.length != 0 && this.behavior != 4 && this.behavior != 5) {
				if (this.path[0].x == 10 && this.path[0].y == 8) {
					this.path = [];
				};
		};*/
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
				/*if (Math.abs(Math.floor(this.pos.x / 32) - this.path[0].x) > 1) {
					this.m_pos.x = 1 * this.m_speed;
					return;
				};*/
				this.left();
			} else {
				/*if (Math.abs(Math.floor(this.pos.x / 32) - this.path[0].x) > 1) {
					this.m_pos.x = -1 * this.m_speed;
					return;
				};*/
				this.right();
			};
		}
		// проверка видимости цели
		if (this.behavior == "passive") {
			var res = b_Controller.check_visibility.call(this);
			if (res) {
				b_Controller.set_chase.call(this);
			};
		};
	}
};