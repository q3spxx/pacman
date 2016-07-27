var gl = {
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
			gl.render();
			gl.anim();
			gl.mess();
			gl.scope();
			gl.fps_timer();
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
		map.textBaseline = "top";
		map.fillText(Scope.main, 40, 10);
	}
};