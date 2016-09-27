var _Map = {
	grid: null,
	graph: null,
	gridOfPath: null,
	eventGraph: null,
	createGrid: function () {
		this.grid = new Grid();
	},
	init: function () {
		var stringMap = BlocksPos.getMap().split("");
		var x = 0;
		var y = 0;
		stringMap.forEach(function (symbol) {
			switch (symbol) {
				case "e":
				_Map.grid[x][y].setObject(ComparitionSymbols[symbol], symbol, false)
				break
				case "w":
				_Map.grid[x][y].setObject(ComparitionSymbols[symbol], symbol, false)
				break
				case "d":
				_Map.grid[x][y].setObject(ComparitionSymbols[symbol], symbol, "doors")
				break
				case "f":
				_Map.grid[x][y].setObject(ComparitionSymbols[symbol], symbol, "foods")
				break
				case "g":
				_Map.grid[x][y].setObject(ComparitionSymbols[symbol], symbol, "energisers")
				break
			}
			x++
			if (x > 20) {
				x = 0
				y++
			}
		})
	},
	createGraph: function () {
		var graph = [];
		var num = 0;
		var x = 0;
		var y = 0;
		this.gridOfPath = function () {
				var arr = []
				for (var i = 0; i < 21; i++) {
					arr.push([])
					for (var j = 0; j < 21; j++) {
						arr[i].push({})
					}
				}
				return arr
			}()
		var maskOfPath = BlocksPos.getMaskOfPath().split("");
		maskOfPath.forEach(function (cell) {
			switch (cell) {
				case "w":
					_Map.gridOfPath[x][y].block = true
				break
				case "e": 
					var graphCell = new GraphCell(x, y, num)
					graph.push(graphCell)
					_Map.grid[x][y].object.graphObject = graphCell
					_Map.gridOfPath[x][y].block = false
					num++
				break
			}
			_Map.gridOfPath[x][y].x = x
			_Map.gridOfPath[x][y].y = y
			x++
			if (x > 20) {
				x = 0
				y++
			}
		})
		graph.forEach(function (gO) {
			var cords = _Map.searchNeighbors(_Map.gridOfPath[gO.x][gO.y], _Map.gridOfPath);
			var neighs = cords.map(function (cord) {
				for (var i = 0; i < graph.length; i++) {
					if (cord.x == graph[i].x && cord.y == graph[i].y) {
						return graph[i];
					};
				};
			});
			gO.neighs = neighs;
		});
		this.graph = graph;
	},
	searchNeighbors: function (cell, grid) {
		var arr = [];
		var tempArr = [ {x:  1,  y:  0}, 
						{x: -1,  y:  0},
						{x:  0,  y:  1},
						{x:  0,  y: -1}];
		tempArr.forEach(function (cord) {
			var res = _Map.search(cell, grid, cord.x, cord.y);
			if (res != false) {
				arr.push(res);
			};
		});
		return arr;
	},
	search: function (cell, grid, x, y) {
		var nX = cell.x + x
		var nY = cell.y + y

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
		if (!_Map.gridOfPath[nX][nY].block) {
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
	},
	createEventGraph: function () {
		var eventMap = BlocksPos.getEventMap().split('')
		var x = 0
		var y = 0
		this.eventGraph = eventMap.map(function (cell) {
			if (x > 20) {
				x = 0
				y++
			}
			var eventCell = new EventCell(x, y, cell)
			x++
			return eventCell
		})
	},
	default: function () {
		MapObjects.doors.array.forEach(function (door) {
			if (door.curState == 1) {
				door.changeState()
			}
		})
		MapObjects.foods.array.forEach(function (food) {
			if (food.curState == 1) {
				food.changeState()
			}
		})
		MapObjects.energisers.array.forEach(function (energiser) {
			if (energiser.curState == 1) {
				energiser.changeState()
			}
		})
	}
}