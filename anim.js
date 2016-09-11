var Anim = {
	lib: {
		pacman: {},
		blinky: {},
		pinky: {},
		bob: {},
		paul: {}
	},
	handle: null,
	text_handle: null,
	type: [],
	changeFrame: function () {
		gl.anim.forEach(function (buffer, i) {
			buffer.curFrame += 1;
			if (buffer.repeat) {
				if (buffer.curFrame >= buffer.totalFrames) {
					buffer.curFrame = 0;
				};
			} else {
				if (buffer.curFrame >= buffer.totalFrames) {
					gl.anim.splice(i, 1)
				};
			};
		});
	},
	change_text_frame: function () {
		text_buf.forEach(function (buf, i) {
			buf.cur_frame += 1;
			if (buf.cur_frame > buf.t_frame) {
				text_buf.splice(i, 1);
			};
		});
	},
	show_mess: function (text, pos, size, color, type) {
		var new_mess = new tBuf(text, pos, size, color, type);
		text_buf.push(new_mess);
	},

	init: function () {
		this.addAnimation('pacman', 'dead', Imgs.dead, 0, 0, 32, 32, 5, false)
		this.addAnimation('pacman', 'left', Imgs.pacman, 0, 0, 32, 32, 2, true)
		this.addAnimation('pacman', 'up', Imgs.pacman, 0, 32, 32, 32, 2, true)
		this.addAnimation('pacman', 'right', Imgs.pacman, 0, 64, 32, 32, 2, true)
		this.addAnimation('pacman', 'down', Imgs.pacman, 0, 96, 32, 32, 2, true)

		this.addAnimation('blinky', 'left', Imgs.blinky, 0, 0, 32, 32, 2, true)
		this.addAnimation('blinky', 'up', Imgs.blinky, 0, 32, 32, 32, 2, true)
		this.addAnimation('blinky', 'right', Imgs.blinky, 0, 64, 32, 32, 2, true)
		this.addAnimation('blinky', 'down', Imgs.blinky, 0, 96, 32, 32, 2, true)

		this.addAnimation('pinky', 'left', Imgs.pinky, 0, 0, 32, 32, 2, true)
		this.addAnimation('pinky', 'up', Imgs.pinky, 0, 32, 32, 32, 2, true)
		this.addAnimation('pinky', 'right', Imgs.pinky, 0, 64, 32, 32, 2, true)
		this.addAnimation('pinky', 'down', Imgs.pinky, 0, 96, 32, 32, 2, true)

		this.addAnimation('bob', 'left', Imgs.bob, 0, 0, 32, 32, 2, true)
		this.addAnimation('bob', 'up', Imgs.bob, 0, 32, 32, 32, 2, true)
		this.addAnimation('bob', 'right', Imgs.bob, 0, 64, 32, 32, 2, true)
		this.addAnimation('bob', 'down', Imgs.bob, 0, 96, 32, 32, 2, true)

		this.addAnimation('paul', 'left', Imgs.paul, 0, 0, 32, 32, 2, true)
		this.addAnimation('paul', 'up', Imgs.paul, 0, 32, 32, 32, 2, true)
		this.addAnimation('paul', 'right', Imgs.paul, 0, 64, 32, 32, 2, true)
		this.addAnimation('paul', 'down', Imgs.paul, 0, 96, 32, 32, 2, true)
	},
	addAnimation: function (category, name, img, x, y, w, h, totalFrames, repeat) {
		this.lib[category][name] = new Animation(img, x, y, w, h, totalFrames, repeat)
	},
	addAnimationBuffer: function (context, name) {
		var animationBuffer = new AnimationBuffer(context, name);
		gl.anim.push(animationBuffer);
		context.animationBufferId = animationBuffer.id
	},
	removeAnimationBuffer: function (animationBufferId) {
		for (var i = 0; i < gl.anim.length; i++) {
			if (animationBufferId == gl.anim[i].id) {
				gl.anim.splice(i, 1)
				return
			};
		}
	}
};
function init_type () {
	var type = [];
	for (var i = 16; i >= -16; i = i - 2) {
		var pos = {
			x: 0,
			y: i
		}
		type.push(pos);
	};
	Anim.type.push(type);
};
function change_buf_event_frame () {
	setInterval(function () {
		gl.buf_event.forEach(function (buf) {
			buf.cur_frame += 1
			if (buf.cur_frame >= buf.t_frames) {
				buf.cur_frame = 0
			}
		})
	}, 240)
}