var gl = {
	special: [],
	event: [],
	fps: 0,
	ms: 0,
	fps_timer: function () {
		var new_date = new Date();
		var ms = new_date.getTime();
		gl.fps = (1000 / (ms - gl.ms)).toFixed(1);
		gl.ms = ms;
		map.fillStyle = 'rgb(255,255,255)';
		map.font = "16px Arial";
		map.textBaseline = "top";
		map.fillText("fps: " + gl.fps, 560, 10);
	},
	start: function () {
		var date = new Date();
		gl.ms = date.getTime();
		setInterval(function () {
			map.globalAlpha = 0.95
			gl.render();
			gl.draw_special();
			gl.draw_bomb()
			gl.anim();
			gl.draw_event();
			gl.scope();
			gl.draw_lifes()
			gl.level();
			gl.mess();
			gl.draw_center_mess()
			gl.draw_sound_mess()
			gl.fps_timer();
			gl.skill_icons()
		}, 33);
	},
	render: function () {
		Map.grid.forEach(function (xArr) {
			xArr.forEach(function (cell) {
				map.drawImage(cell.img.pic,
							cell.img.pos.x,
							cell.img.pos.y,
							32,
							32,
							cell.x,
							cell.y,
							32,
							32
							);
			});
		});
	},
	anim: function () {
		anim.forEach(function (buf) {
			map.drawImage(buf.img,
						buf.action[buf.curAction].frames[buf.curFrame].x,
						buf.action[buf.curAction].frames[buf.curFrame].y,
						32,
						32,
						buf.pos.x,
						buf.pos.y,
						32,
						32
						);
		});
	},
	mess: function () {
		text_buf.forEach(function (buf) {
			map.fillStyle = 'rgba(' + buf.color + ',1)';
			map.font = buf.size + 'px Arial';
			map.textBaseline = "top";
			map.fillText(buf.text, 	buf.pos.x + Anim.type[buf.type][buf.cur_frame].x,
															buf.pos.y + Anim.type[buf.type][buf.cur_frame].y);
		});
	},
	scope: function () {
		map.fillStyle = 'rgb(255,255,255)';
		map.font = "16px Arial";
		map.textAlign = "left";
		map.textBaseline = "top";
		map.fillText("Scope: " + Scope.main, 40, 10);
	},
	level: function () {
		map.fillStyle = 'rgb(255,255,255)';
		map.font = "16px Arial";
		map.textBaseline = "top";
		map.fillText("Level: " + _data.level, 200, 10);
	},
	draw_special: function () {
		this.special.forEach(function(buf){
			var num = {};
			num.x = Math.floor(buf.w / buf.img.w);
			num.y = Math.floor(buf.h / buf.img.h);
			for (var x = 0; x != num.x; x = x + num.x / Math.abs(num.x)) {
				for (var y = 0; y != num.y; y = y + num.y / Math.abs(num.y)) {
					map.drawImage(	buf.img.pic,
									buf.img.x,
									buf.img.y,
									buf.img.w,
									buf.img.h,
									buf.x + (x * buf.img.w),
									buf.y + (y * buf.img.h),
									buf.img.w,
									buf.img.h
									);
				};
			};
			return
		});
	},
	draw_event: function () {
		gl.event.forEach(function (e) {
			map.drawImage(
					e.img.pic,
					e.img.x,
					e.img.y,
					e.img.w,
					e.img.h,
					e.x,
					e.y,
					e.img.w,
					e.img.h
				);
		});
	},
	draw_lifes: function () {
		var i = 0;
		while (i != _data.lives) {
			map.drawImage(	Imgs.pacman,
							64,
							32,
							32,
							32,
							300 + i * 20,
							8,
							16,
							16
							);
			i++
		}
	},
	draw_center_mess: function () {
		if (_data.center_mess_switch) {
			map.fillStyle = 'rgb(255,255,255)';
			map.font = "26px Arial";
			map.textAlign = "center";
			map.textBaseline = "top";
			map.fillText(_data.center_mess, 336, 352);
		}
	},
	draw_bomb: function () {
		map.beginPath()
		map.fillStyle = 'rgba(255, 100, 0, 255)'
		map.arc(Player.pos.x + 16, Player.pos.y + 16, Special.bomb.radius, 0, 2 * Math.PI)
		map.fill()
	},
	draw_sound_mess: function () {
		if (Sounds.on) {
			map.fillStyle = 'rgb(255,255,255)';
			map.font = "60px Arial";
			map.textAlign = "center";
			map.textBaseline = "top";
			map.fillText(Sounds.mess, 336, 250)
		};
	},
	skill_icons: function () {
		if (Special.get_over_here.ready) {
			map.globalAlpha = 0.95
		} else {
			map.globalAlpha = 0.5
		}
		map.drawImage(
			Imgs.icons.cord,
			0,
			0,
			32,
			32,
			272,
			640,
			32,
			32
			)
			map.globalAlpha = 0.95
			map.fillStyle = 'rgb(255,255,255)';
			map.font = "8px Arial";
			map.textAlign = "left";
			map.textBaseline = "bottom";
			map.fillText("q", 272, 672)


		if (!Special.get_over_here.ready) {
			map.font = "16px Arial";
			map.textAlign = "center";
			map.textBaseline = "middle";
			map.fillText(Special.get_over_here.cooldown + " s", 288, 656)
		}

		if (Special.bomb.ready) {
			map.globalAlpha = 0.95
		} else {
			map.globalAlpha = 0.5
		}

		map.drawImage(
			Imgs.icons.bomb,
			0,
			0,
			32,
			32,
			368,
			640,
			32,
			32
			)

			if (!Special.bomb.ready) {
				map.globalAlpha = 0.95
				map.font = "16px Arial";
				map.textAlign = "center";
				map.textBaseline = "middle";
				map.fillText(Special.bomb.cooldown + " s", 384, 656)
			}

			map.globalAlpha = 0.95
			map.fillStyle = 'rgb(255,255,255)';
			map.font = "8px Arial";
			map.textAlign = "left";
			map.textBaseline = "bottom";
			map.fillText("r", 368, 672)
	}
};