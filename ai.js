var Astar = {
	open: [],
	closed: [],
	s: null,
	e: null,
	h: function (n) {
		var xd = Math.abs(n.x - this.e.x);
		var yd = Math.abs(n.y - this.e.y);
		return Math.pow(xd, 2) + Math.pow(yd, 2);
	},
	func: function () {
		var e = _Map.graph[this.e];
		e.g = 0;
		e.h = this.h(e);
		e.f = Math.pow(e.h, 2);
		e.parent = null;
		this.open.push(e);
		e.arr = 0;
		while (this.open.length > 0) {
			var n = this.getMinF();
			if (n.num == this.s) {
				var res = [];
				while (n.num != Astar.e) {
					n = n.parent;
					res.push({x: n.x, y: n.y});
				};
				return res;
			};
			n.neighs.forEach(function (son) {
				if (son.block) {
					return
				};
				var newg = Math.sqrt(n.g) + 1;
				if (son.arr != null) {
					return;
				};
				son.parent = n;
				son.g = newg;
				son.h =  Astar.h(son);
				son.f = Math.pow(son.g, 2) + son.h;
				if (son.arr == 1) {
					for (var i = 0; i < Astar.closed.length; i++) {
						if (Astar.closed[i].num == son.num) {
								Astar.closed.splice(i, 1);
								break;
						};
					};
					son.arr = null;
				};
				if (son.arr != 0) {
					Astar.open.push(son);
					son.arr = 0;
				};
			});
			Astar.closed.push(n);
			for (var i = 0; i < Astar.open.length; i++) {
				if (Astar.open[i].num == n.num) {
						Astar.open.splice(i, 1);
						break;
				};
			};
			n.arr = 1;
		};
		return []
	},
	getMinF: function () {
		var sort = this.open.sort(function (a, b) {
			if (a.f > b.f) {
				return 1;
			} else if (a.f < b.f) {
				return -1;
			} else {
				return 0;
			};
		});
		return sort[0];
	},
	defineNum: function (pos) {
		var num = 0;
		while (num < _Map.graph.length) {
			if (pos.x == _Map.graph[num].x && pos.y == _Map.graph[num].y) {
				return num;
			};
			num++;
		};
	},
	clear: function () {
		this.open = [];
		this.closed = [];
		this.s = null;
		this.e = null;
	}
};

var ai = {
	playerPos: {
		x: 10,
		y: 15
	},
	hPlayer: function (n) {
		var xd = Math.abs(n.x - this.playerPos.x);
		var yd = Math.abs(n.y - this.playerPos.y);
		return Math.pow(xd, 2) + Math.pow(yd, 2);
	},
	getMaxF: function (arr) {
		var sort = arr.sort(function (a, b) {
			if (a.f > b.f) {
				return -1;
			} else if (a.f < b.f) {
				return 1;
			} else {
				return 0;
			};
		});
		return sort[0];
	},
	searchPath: function () {
		var currentPos = {
			x: Math.floor(this.pos.x / 32),
			y: Math.floor(this.pos.y / 32)
		};
		if (currentPos.x == this.pointPos.x && currentPos.y == this.pointPos.y) {
			return;
		};
		this.path = [];
		Astar.s = Astar.defineNum(currentPos);
		Astar.e = Astar.defineNum(this.pointPos);
		this.path = Astar.func();
		_Map.graphClear();
		Astar.clear();
	},
	fear: function () {
		var self = this;
		if (((self.pos.x / 32) - (Math.floor(self.pos.x / 32))) != 0 ||
			((self.pos.y / 32) - (Math.floor(self.pos.y / 32))) != 0) {
			return;
		};
		// if (this.path.length != 0) {
		// 	return
		// }
		var currentPos = {
			x: Math.floor(self.pos.x / 32),
			y: Math.floor(self.pos.y / 32)
		};
		self.path = [];
		var num = Astar.defineNum(currentPos);
		var neighs = _Map.graph[num].neighs.map(function (n) {
			var f = ai.hPlayer(n);
			return {f: f, x: n.x, y: n.y}
		});
		neigh = ai.getMaxF(neighs);
		self.path.push(neigh);
	},
	passive: {
		areas: {
			all: [],
			select: function () {
				var random
				do {
					random = Math.round(Math.random() * (this.all.length - 1))
				}
				while(this.all[random].unit)
				return this.all[random]
			}
		},
		player: false,
		units:[],
		addUnit: function (enemy) {
			for (var i = 0; i < this.units.length; i++) {
				if (this.units[i].id == enemy.id) {
					return this.units[i]
				}
			}
			var unit = {
				id: enemy.id,
				unit: enemy,
				area: false,
				notChecked: [],
				selectNode: function () {
					if (this.notChecked.length == 0) {
						var area = ai.passive.areas.select()
						this.area.unit = false
						this.area = false
						area.appoint(this)
					}
					var random = Math.round(Math.random() * (this.notChecked.length - 1))
					var selectedNode = this.notChecked[random]
					this.notChecked.splice(random, 1)
					return selectedNode
				}
			}
			this.units.push(unit)
			return unit
		},
		remove: function (enemy) {
			for (var i = 0; i < this.units.length; i++) {
				if (this.units[i].id == enemy.id) {
					this.units.splice(i, 1)
					return
				}
			}
		},
		checkPlayer: function () {
			return this.player
		},
		addArea: function (name) {
			this.areas[name] = new Area()
			this.areas.all.push(this.areas[name])
		},
		init: function () {
			this.addArea('a')
			this.addArea('b')
			this.addArea('c')
			this.addArea('d')
			this.addArea('e')
			var charsNodes = BlocksPos.getNodes().split('')
			var i = 0
			for (var y = 0; y < 21; y++) {
				for (var x = 0; x < 21; x++) {
					if (charsNodes[i] == "a") {
						this.areas.a.nodes.push({x: x, y: y})
					}
					if (charsNodes[i] == "b") {
						this.areas.b.nodes.push({x: x, y: y})
					}
					if (charsNodes[i] == "c") {
						this.areas.c.nodes.push({x: x, y: y})
					}
					if (charsNodes[i] == "d") {
						this.areas.d.nodes.push({x: x, y: y})
					}
					if (charsNodes[i] == "e") {
						this.areas.e.nodes.push({x: x, y: y})
					}
					i++
				}
			}
		},
		method: function () {
			if (this.path.length != 0) {
				return
			}

			var unit = ai.passive.addUnit(this)

			if (!unit.area) {
				var area = ai.passive.areas.select()
				area.appoint(unit)
			}

			this.pointPos = unit.selectNode()
			// var currentPos = {
			// 	x: Math.floor(self.pos.x / 32),
			// 	y: Math.floor(self.pos.y / 32)
			// };

			// var num = Astar.defineNum(currentPos);

			// var random;

			// do {
			// 	random = Math.round((_Map.graph[num].neighs.length - 1) * Math.random());
			// } while (_Map.grid[_Map.graph[num].neighs[random].x][_Map.graph[num].neighs[random].y].object.block || _Map.graph[num].neighs[random].x == 10 && _Map.graph[num].neighs[random].y == 8);

			// self.pointPos = _Map.graph[num].neighs[random];

			ai.searchPath.call(this);
		}
	},
	free: function () {
		ai.searchPath.call(this);
	}
};