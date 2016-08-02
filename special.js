var Special = {
	get_over_here: {
		handle: null,
		start: function () {
			_data.status = "special";
			Player.m_pos.x = 0;
			Player.m_pos.y = 0;
			Sounds.get_over_here.play();

			var type;

			var img = {
				pic: Imgs.cord,
				x: 0,
				y: 0,
				w: 4,
				h: 4
			};

			var special_buf = new Special_buf(img, 4, 4);

			gl.special.push(special_buf);

			Special.get_over_here.handle = setInterval(function () {
				switch (Player.curAction) {
					case 0: this.w -= 4 
					break
					case 1: this.h -= 4
					break
					case 2: this.w += 4
					break
					case 3: this.h += 4
					break
				}

				var enemy = Col.special_check_enemy.call(this);

				if (enemy != false) {
					Special.get_over_here.stop();
					Sounds.scream.play()
					enemy.grab();
					Special.get_over_here.return_cord.call(this, enemy);
					return;
				};

				if (Col.special_check.call(this)) {
					Special.get_over_here.stop();
					Special.get_over_here.return_cord.call(this);
					return;
				};
			}.bind(special_buf), 1);
		},
		return_cord: function (e) {
			var enemy = e;
			Special.get_over_here.handle = setInterval(function(){
				switch (Player.curAction) {
					case 0: this.w += 4
							if (enemy) {enemy.pos.x += 4}
					break
					case 1: this.h += 4
							if (enemy) {enemy.pos.y += 4}
					break
					case 2: this.w -= 4
							if (enemy) {enemy.pos.x -= 4}
					break
					case 3: this.h -= 4
							if (enemy) {enemy.pos.y -= 4}
					break
				}
				if (this.w == 4 && this.h == 4) {
					Special.get_over_here.stop();

					if (enemy) {
						Sounds.eatghost.play()
						if (_data.firstblood) {
							_data.firstblood = false;
							setTimeout(function () {
								Sounds.firstblood.play()
							}, 1000);
						};

						_data.kills += 1;

						if (_data.kill) {
							var say;

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

						Anim.show_mess("200", {x: enemy.pos.x, y: enemy.pos.y}, 18, color['white'], 0);
						Scope.main += 200;
						enemy.go_to_room();
					};

					for (var i = 0; i < gl.special.length; i++) {
						if (this.id == gl.special[i].id) {
							gl.special.splice(i, 1);
							break
						};
					};
					_data.status = "play";
				}

			}.bind(this), 1); 
		},
		stop: function () {
			clearInterval(Special.get_over_here.handle);
		}
	},
	yo: {
		handle: null,
		date: null,
		status: false,
		start: function () {
			Special.yo.status = true;
			var img = {
				pic: Imgs.yo,
				x: 0,
				y: 0,
				w: 110,
				h: 110
			}
			var event_buf = new Event_buf(img, 672, 672);
			gl.event.push(event_buf);

			Sounds.yo.play();

			Special.yo.handle = setInterval(function () {
				this.x -= 11;
				this.y -= 11;
				if (this.x == 562 && this.y == 562) {
					Special.yo.stop()
					Special.yo.waiting.call(this);
				};
			}.bind(event_buf), 10);
		},
		waiting: function () {
			var date = new Date();
			Special.yo.date = date.getTime();
			Special.yo.handle = setInterval(function () {
				var new_date = new Date();
				var time = new_date.getTime();
				if (time - Special.yo.date > 600) {
					Special.yo.stop()
					Special.yo.clean_up.call(this);
				};
			}.bind(this), 10);
		},
		clean_up: function () {
			Special.yo.handle = setInterval(function () {
				this.x += 11;
				this.y += 11;
				if (this.x == 672 && this.y == 672) {
					Special.yo.stop()
					for (var i = 0; i < gl.event.length; i++) {
						if (this.id == gl.event[i].id) {
							gl.event.splice(i, 1);
							break
						};
					};
					Special.yo.status = false
					Event.set_random_event();
				};
			}.bind(this), 10);
		},
		stop: function () {
			clearInterval(Special.yo.handle);
		}
	}
}