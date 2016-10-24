var Move = {
	set: function () {
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
						behaviorController.killPlayer()
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
				if (Events.energiser.activated) {
					var enemy = Col.checkEnemy.call(this);
					if (
						enemy != false && enemy.behavior == "fear" ||
						enemy != false && enemy.behavior == "fearPreTimeout"
						) {
						Sounds.eatghost.play()
						behaviorController.killEnemy(enemy)
					} else if (enemy != false && enemy.behavior == "shocked" && Special.shock.isFeared) {
						Sounds.eatghost.play()
						behaviorController.killEnemy(enemy)
					};
				};
				if (Events.gain.curGain != false && !Events.gain.activated) {
					if (Col.checkGain.call(this)) {
						Events.gain.activate()
					}
				}
			};
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
				behaviorController.setPassive.call(this);
			} else if (this.behavior == 'goToRoom') {
				this.enterToRoom()
			}
			return;
		};
		//Удаление достигнутой точки
		if (this.pos.x == this.path[0].x * 32 && this.pos.y == this.path[0].y * 32) {
			this.path.splice(0, 1);
		};
		//Остановка после достижения конечной точки
		if (this.path.length == 0) {
			this.stop();
			return;
		};

		if (this.pos.x == this.path[0].x * 32) {
			if (this.pos.y > this.path[0].y * 32) {
				this.up()
			} else {
				this.down()
			};
		} else if (this.pos.y == this.path[0].y * 32) {
			if (this.pos.x > this.path[0].x * 32) {
				this.left();
			} else {
				this.right();
			};
		} else if (this.path.length != 0) {
			this.path.splice(0, 0, {x: Math.floor(this.pos.x / 32), y: Math.floor(this.pos.y / 32)})
			Move.aiDirection.call(this)
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