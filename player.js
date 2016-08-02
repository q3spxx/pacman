var Player = {
	id: 4,
	pos: {
		x: 320,
		y: 480
	},
	m_pos: {
		x: 0,
		y: 0
	},
	handle: null,
	img: null,
	curAction: 0,
	speed: 6,
	is_dead: function () {
		var aBuf = new AnimBuf(0, this, 5, false);
		this.img = imgs[7];
		this.curAction = 4;
		anim[0] = aBuf;
	},
	action: [
		{
			frames: [
				{
					x: 0,
					y: 0
				},
				{
					x: 0,
					y: 32
				}
			]
		},
		{
			frames: [
				{
					x: 32,
					y: 0
				},
				{
					x: 32,
					y: 32
				}
			]
		},
		{
			frames: [
				{
					x: 64,
					y: 0
				},
				{
					x: 64,
					y: 32
				}
			]
		},
		{
			frames: [
				{
					x: 96,
					y: 0
				},
				{
					x: 96,
					y: 32
				}
			]
		},
		{
			frames: [
				{
					x: 0,
					y: 0
				},
				{
					x: 32,
					y: 0
				},
				{
					x: 64,
					y: 0
				},
				{
					x: 96,
					y: 0
				},
				{
					x: 128,
					y: 0
				}
			]
		}
	]
};