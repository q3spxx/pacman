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
		this.addAnimation('blinky', 'default', Imgs.blinky, 0, 128, 32, 32, 2, true)
		this.addAnimation('blinky', 'eyesLeft', Imgs.eyes, 0, 0, 32, 32, 2, true)
		this.addAnimation('blinky', 'eyesUp', Imgs.eyes, 0, 32, 32, 32, 2, true)
		this.addAnimation('blinky', 'eyesRight', Imgs.eyes, 0, 64, 32, 32, 2, true)
		this.addAnimation('blinky', 'eyesDown', Imgs.eyes, 0, 96, 32, 32, 2, true)
		this.addAnimation('blinky', 'fearLeft', Imgs.blinkyFear, 0, 0, 32, 32, 1, true)
		this.addAnimation('blinky', 'fearUp', Imgs.blinkyFear, 0, 32, 32, 32, 1, true)
		this.addAnimation('blinky', 'fearRight', Imgs.blinkyFear, 0, 64, 32, 32, 1, true)
		this.addAnimation('blinky', 'fearDown', Imgs.blinkyFear, 0, 96, 32, 32, 1, true)
		this.addAnimation('blinky', 'fearPreTimeoutLeft', Imgs.fearPreTimeout, 0, 0, 32, 32, 2, true)
		this.addAnimation('blinky', 'fearPreTimeoutUp', Imgs.fearPreTimeout, 0, 32, 32, 32, 2, true)
		this.addAnimation('blinky', 'fearPreTimeoutRight', Imgs.fearPreTimeout, 0, 64, 32, 32, 2, true)
		this.addAnimation('blinky', 'fearPreTimeoutDown', Imgs.fearPreTimeout, 0, 96, 32, 32, 2, true)

		this.addAnimation('pinky', 'left', Imgs.pinky, 0, 0, 32, 32, 2, true)
		this.addAnimation('pinky', 'up', Imgs.pinky, 0, 32, 32, 32, 2, true)
		this.addAnimation('pinky', 'right', Imgs.pinky, 0, 64, 32, 32, 2, true)
		this.addAnimation('pinky', 'down', Imgs.pinky, 0, 96, 32, 32, 2, true)
		this.addAnimation('pinky', 'default', Imgs.pinky, 0, 128, 32, 32, 2, true)
		this.addAnimation('pinky', 'eyesLeft', Imgs.eyes, 0, 0, 32, 32, 2, true)
		this.addAnimation('pinky', 'eyesUp', Imgs.eyes, 0, 32, 32, 32, 2, true)
		this.addAnimation('pinky', 'eyesRight', Imgs.eyes, 0, 64, 32, 32, 2, true)
		this.addAnimation('pinky', 'eyesDown', Imgs.eyes, 0, 96, 32, 32, 2, true)
		this.addAnimation('pinky', 'fearLeft', Imgs.pinkyFear, 0, 0, 32, 32, 1, true)
		this.addAnimation('pinky', 'fearUp', Imgs.pinkyFear, 0, 32, 32, 32, 1, true)
		this.addAnimation('pinky', 'fearRight', Imgs.pinkyFear, 0, 64, 32, 32, 1, true)
		this.addAnimation('pinky', 'fearDown', Imgs.pinkyFear, 0, 96, 32, 32, 1, true)
		this.addAnimation('pinky', 'fearPreTimeoutLeft', Imgs.fearPreTimeout, 0, 0, 32, 32, 2, true)
		this.addAnimation('pinky', 'fearPreTimeoutUp', Imgs.fearPreTimeout, 0, 32, 32, 32, 2, true)
		this.addAnimation('pinky', 'fearPreTimeoutRight', Imgs.fearPreTimeout, 0, 64, 32, 32, 2, true)
		this.addAnimation('pinky', 'fearPreTimeoutDown', Imgs.fearPreTimeout, 0, 96, 32, 32, 2, true)

		this.addAnimation('bob', 'left', Imgs.bob, 0, 0, 32, 32, 2, true)
		this.addAnimation('bob', 'up', Imgs.bob, 0, 32, 32, 32, 2, true)
		this.addAnimation('bob', 'right', Imgs.bob, 0, 64, 32, 32, 2, true)
		this.addAnimation('bob', 'down', Imgs.bob, 0, 96, 32, 32, 2, true)
		this.addAnimation('bob', 'default', Imgs.bob, 0, 128, 32, 32, 2, true)
		this.addAnimation('bob', 'eyesLeft', Imgs.eyes, 0, 0, 32, 32, 2, true)
		this.addAnimation('bob', 'eyesUp', Imgs.eyes, 0, 32, 32, 32, 2, true)
		this.addAnimation('bob', 'eyesRight', Imgs.eyes, 0, 64, 32, 32, 2, true)
		this.addAnimation('bob', 'eyesDown', Imgs.eyes, 0, 96, 32, 32, 2, true)
		this.addAnimation('bob', 'fearLeft', Imgs.bobFear, 0, 0, 32, 32, 1, true)
		this.addAnimation('bob', 'fearUp', Imgs.bobFear, 0, 32, 32, 32, 1, true)
		this.addAnimation('bob', 'fearRight', Imgs.bobFear, 0, 64, 32, 32, 1, true)
		this.addAnimation('bob', 'fearDown', Imgs.bobFear, 0, 96, 32, 32, 1, true)
		this.addAnimation('bob', 'fearPreTimeoutLeft', Imgs.fearPreTimeout, 0, 0, 32, 32, 2, true)
		this.addAnimation('bob', 'fearPreTimeoutUp', Imgs.fearPreTimeout, 0, 32, 32, 32, 2, true)
		this.addAnimation('bob', 'fearPreTimeoutRight', Imgs.fearPreTimeout, 0, 64, 32, 32, 2, true)
		this.addAnimation('bob', 'fearPreTimeoutDown', Imgs.fearPreTimeout, 0, 96, 32, 32, 2, true)

		this.addAnimation('paul', 'left', Imgs.paul, 0, 0, 32, 32, 2, true)
		this.addAnimation('paul', 'up', Imgs.paul, 0, 32, 32, 32, 2, true)
		this.addAnimation('paul', 'right', Imgs.paul, 0, 64, 32, 32, 2, true)
		this.addAnimation('paul', 'down', Imgs.paul, 0, 96, 32, 32, 2, true)
		this.addAnimation('paul', 'default', Imgs.paul, 0, 128, 32, 32, 2, true)
		this.addAnimation('paul', 'eyesLeft', Imgs.eyes, 0, 0, 32, 32, 2, true)
		this.addAnimation('paul', 'eyesUp', Imgs.eyes, 0, 32, 32, 32, 2, true)
		this.addAnimation('paul', 'eyesRight', Imgs.eyes, 0, 64, 32, 32, 2, true)
		this.addAnimation('paul', 'eyesDown', Imgs.eyes, 0, 96, 32, 32, 2, true)
		this.addAnimation('paul', 'fearLeft', Imgs.paulFear, 0, 0, 32, 32, 1, true)
		this.addAnimation('paul', 'fearUp', Imgs.paulFear, 0, 32, 32, 32, 1, true)
		this.addAnimation('paul', 'fearRight', Imgs.paulFear, 0, 64, 32, 32, 1, true)
		this.addAnimation('paul', 'fearDown', Imgs.paulFear, 0, 96, 32, 32, 1, true)
		this.addAnimation('paul', 'fearPreTimeoutLeft', Imgs.fearPreTimeout, 0, 0, 32, 32, 2, true)
		this.addAnimation('paul', 'fearPreTimeoutUp', Imgs.fearPreTimeout, 0, 32, 32, 32, 2, true)
		this.addAnimation('paul', 'fearPreTimeoutRight', Imgs.fearPreTimeout, 0, 64, 32, 32, 2, true)
		this.addAnimation('paul', 'fearPreTimeoutDown', Imgs.fearPreTimeout, 0, 96, 32, 32, 2, true)
	},
	addAnimation: function (category, name, img, x, y, w, h, totalFrames, repeat) {
		this.lib[category][name] = new Animation(img, x, y, w, h, totalFrames, repeat)
	},
	addAnimationBuffer: function (context, name) {
		var animationBuffer = new AnimationBuffer(context, name);
		gl.anim.push(animationBuffer);
		context.animationBuffer = animationBuffer
	},
	removeAnimationBuffer: function (animationBuffer) {
		if (animationBuffer == null) {
			return
		}
		for (var i = 0; i < gl.anim.length; i++) {
			if (animationBuffer.id == gl.anim[i].id) {
				gl.anim.splice(i, 1)
				return
			};
		}
	}
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