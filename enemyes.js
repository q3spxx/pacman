var enemy_arr = [];
var behavior = [
	{
		name: "chase",
		speed: 7
	},
	{
		name: 'fear',
		speed: 14
	}
];
var Blinky = {
	id: 0,
	pos: {
		x: 320,
		y: 224
	},
	m_pos: {
		x: 1,
		y: 0
	},
	handle: null,
	point_pos: ai.player_pos,
	path: [],
	img: null,
	curAction: 0,
	behavior: 2,
	speed: 12,
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
		}
	]
};
enemy_arr.push(Blinky);