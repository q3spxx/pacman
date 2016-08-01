var Anim = {
	handle: null,
	text_handle: null,
	type: [],
	change_frame: function () {
		anim.forEach(function (buf) {
			buf.curFrame += 1;
			if (buf.repeat) {
				if (buf.curFrame >= buf.tFrames) {
					buf.curFrame = 0;
				};
			} else {
				if (buf.curFrame >= buf.tFrames) {
					buf.curFrame = buf.tFrames - 1;
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
function test () {
	Anim.show_mess("200", {x: 0, y: 0}, 18, color['white'], 0);
}