var Map = {
	grid: newGrid(),
	addElem: function (elem) {
		elem.forEach(function (cell) {
			Map.grid[cell.x][cell.y].img = cell.img;
			Map.grid[cell.x][cell.y].block = cell.block;
			Map.grid[cell.x][cell.y].type = cell.type;
		});
	},
	graph: null,
	createGraph: function () {
		var graph = [];
		var num = 0;
		for (var x = 0; x < 21; x++) {
			for (var y = 0; y < 21; y++) {
				if (Map.grid[x][y].block) {
					continue;
				};
				var gObj = {
								x: x,
								y: y,
								f: null,
								g: null,
								h: null,
								neighs: null,
								parent: null,
								arr: null,
								num: num
					};
				graph.push(gObj);
				num++;
			};
		};
		graph.forEach(function (gObj) {
			var cords = Map.searchNeighbors(Map.grid[gObj.x][gObj.y], Map.grid);
			var neighs = cords.map(function (cord) {
				for (var i = 0; i < graph.length; i++) {
					if (cord.x == graph[i].x && cord.y == graph[i].y) {
						return graph[i];
					};
				};
			});
			gObj.neighs = neighs;
		});
		this.graph = graph;
	},
	searchNeighbors: function (cell, grid) {
		var arr = [];
		var tempArr = [{x: 1, y: 0}, 
						{x: -1, y : 0},
						{x: 0, y: 1},
						{x: 0, y: -1}];
		tempArr.forEach(function (cord) {
			var res = Map.search(cell, grid, cord.x, cord.y);
			if (res != false) {
				arr.push(res);
			};
		});
		return arr;
	},
	search: function (cell, grid, x, y) {
			var nX = cell.x/32 + x;
			var nY = cell.y/32 + y;
			if (nY < 0) {
				return false;
			};
			if (nY > 20) {
				return false;
			};
			if (nX > 20) {
				if (nY == 9) {
					nX = 0;
				} else {
					return false;
				};
			}; 
			if (nX < 0) {
				if (nY == 9) {
					nX = 20;
				} else {
					return false;
				};
			};
		if (!Map.grid[nX][nY].block) {
				return {x: nX, y: nY};
			if (grid[nX][nY].status) {
				grid[nX][nY].status = false;
			};
		};
		return false;
	},
	graphClear: function () {
		this.graph.forEach(function (cell) {
			cell.f = null;
			cell.g = null;
			cell.h = null;
			cell.parent = null;
			cell.arr = null;
		});
	}
};