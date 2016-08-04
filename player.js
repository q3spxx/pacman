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
		this.img = Imgs.dead;
		this.set_stop();
		var aBuf = new AnimBuf(0, this, 5, false);
		this.curAction = 4;
		anim[0] = aBuf;
	},
	set_left: function () {
		this.m_pos.x = -1;
		this.m_pos.y = 0;
		this.curAction = 0;
	},
	set_up: function () {
		this.m_pos.x = 0;
		this.m_pos.y = -1;
		this.curAction = 1;
	},
	set_right: function () {
		this.m_pos.x = 1;
		this.m_pos.y = 0;
		this.curAction = 2;
	},
	set_down: function () {
		this.m_pos.x = 0;
		this.m_pos.y = 1;
		this.curAction = 3;
	},
	set_stop: function () {
		this.m_pos.x = 0;
		this.m_pos.y = 0;
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