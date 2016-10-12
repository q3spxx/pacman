var Move = {
	set: function () {
		//for (var i = 0; i < this.speed; i++) {

			if (Col.check.call(this)) {
				var offsetCheck = Col.offsetCheck.call(this);
				if (offsetCheck != false) {
					this.pos.x += offsetCheck.x;
					this.pos.y += offsetCheck.y;
				} else {
					return false;
				};
			};
			this.pos.x += this.mPos.x;
			this.pos.y += this.mPos.y;

			//Portal
			if (this.pos.x < 0) {
				this.pos.x = 640;
			} else if (this.pos.x > 640) {
				this.pos.x = 0;
			};
			if (this.id != 4) {
				var res = Col.checkPlayer.call(this);
				if (res) {
					if (this.behavior == 'chase' ||
						this.behavior == 'passive') {
						if (!Events.energiser.activated) {
							Game.stop()
							Player.isDead();
							_Data.lifes--
							_Tools.setTimeout(function () {
								if (_Data.lifes > 0) {
									Game.default()
									Game.start()
								} else {
									Mess.setMess('gameOver')
								}
							}, 900)
						}
						return
						Sounds.dead.play()
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
				var cell = Col.checkCell.call(this);
				if (cell != false) {
					switch (cell.object.name) {
						case 'food':
							cell.item.changeState()
							Sounds.step.play()
							_Data.addPoints(20)
							_Data.roundPoints++
							_Data.checkEndRound()
						break

						case 'energiser':
							cell.item.changeState()
							_Data.addPoints(50)
							Events.energiser.activate()
						break
					}
				}
				/*if (Event.buf_event) {
					Col.check_event.call(this)
				};*/
				if (Events.energiser.activated) {
					var enemy = Col.checkEnemy.call(this);
					if (
						enemy != false && enemy.behavior == "fear" ||
						enemy != false && enemy.behavior == "fearPreTimeout"
						) {
						behaviorController.killEnemy(enemy)
					};
				};
			};
		//}
		return true;
	},
	aiDirection: function () {
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
						this.left();
					} else if (x > 0) {
						this.right();
					};
					if (y < 0) {
						this.up();
					} else if (y > 0) {
						this.down();
					};
				};
			} else if (this.behavior == "enterToRoom") {
				if (Col.doorFix()) {
					if (MapObjects.doors.d0.curState == 1) {
						MapObjects.doors.d0.changeState()
					}
				}
				behaviorController.setInRoom.call(this);
			} else if (this.behavior == "exitFromRoom") {
				if (Col.doorFix()) {
					if (MapObjects.doors.d0.curState == 1) {
						MapObjects.doors.d0.changeState()
					}
				}
				if (Event.status == 1) {
					if (Event.timeout) {
						this.set_fear_pre_timeout_img()
					} else {
						this.set_fear_img();
					}
					b_Controller.set_fear.call(this)
				} else {
					behaviorController.setPassive.call(this);
				};
			} else if (this.behavior == 'goToRoom') {
				this.enterToRoom()
			} else if (this.behavior == 'shocked') {
				return
			}
			return;
		};
		//Удаление достигнутой точки
		if (this.pos.x == this.path[0].x * 32 && this.pos.y == this.path[0].y * 32) {
			this.path.splice(0, 1);
		};
		//фикс двери
		/*if (this.behavior != 'enter_to_room' && this.behavior != 'exit_from_room') {
				if (this.path[0] != undefined) {
					if (this.path[0].x == 10 && this.path[0].y == 8) {
						this.path = [];
					};
				};
		};*/
		//Остановка после достижения конечной точки
		if (this.path.length == 0) {
			this.stop();
			return;
		};

		/*if (this.behavior == "enter_to_room" || this.behavior == "exit_from_room") {
			if (this.path[0].x == 10 && this.path[0].y == 8) {
				open_door();
			}
		}*/

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
			var res = behaviorController.checkVisibility.call(this);
			if (res) {
				console.log('looked')
				behaviorController.setChase.call(this);
			};
		};
	}
};