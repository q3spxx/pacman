var _Map = {
	grid: new_grid(),
	update: function () {
		Static_blocks.array.forEach(function (block) {
			block.in_map.forEach(function (pos) {
				_Map.grid[pos.x][pos.y].__proto__ = block
			})
		});
		Dynamic_blocks.array.forEach(function (block) {
			_Map.grid[block.in_map.x][block.in_map.y].__proto__ = block
		});
	},
	graph: null,
	create_graph: function () {
		var graph = [];
		var num = 0;
		for (var x = 0; x < 21; x++) {
			for (var y = 0; y < 21; y++) {
				if (_Map.grid[x][y].block && _Map.grid[x][y].type == 'static') {
					continue;
				};
				var g_obj = new Graph_cell(x, y, num)
				graph.push(g_obj);
				num++;
			};
		};
		graph.forEach(function (g_obj) {
			var cords = _Map.search_neighbors(_Map.grid[g_obj.x][g_obj.y], _Map.grid);
			var neighs = cords.map(function (cord) {
				for (var i = 0; i < graph.length; i++) {
					if (cord.x == graph[i].x && cord.y == graph[i].y) {
						return graph[i];
					};
				};
			});
			g_obj.neighs = neighs;
		});
		this.graph = graph;
	},
	search_neighbors: function (cell, grid) {
		var arr = [];
		var tempArr = [{x: 1, y: 0}, 
						{x: -1, y : 0},
						{x: 0, y: 1},
						{x: 0, y: -1}];
		tempArr.forEach(function (cord) {
			var res = _Map.search(cell, grid, cord.x, cord.y);
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
		if (!_Map.grid[nX][nY].block || _Map.grid[nX][nY].type == 'dynamic') {

			return {x: nX, y: nY}
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
}