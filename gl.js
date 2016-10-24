var gl = {
	anim: [],
	mess: [],
	outputs:[],
	effects: [],
	special: [],
	lowLayer: [],
	highLayer: [],
	emitters: [],
	event: [],
	shock: [],
	buf_event: [],
	fps: 0,
	ms: new Date().getTime(),
	clear: function () {
		map.clearRect(0, 0, _Data.canvas.elem.width, _Data.canvas.elem.height)
	},
	fpsTimer: function () {
		var newDate = new Date();
		var ms = newDate.getTime();
		gl.fps = (1000 / (ms - gl.ms)).toFixed(1);
		gl.ms = ms;
		map.fillStyle = 'rgba(' + color.white + ', 1)';
		map.font = "16px Arial";
		map.textBaseline = "middle";
		map.textAlign = "left"
		map.fillText("fps: " + gl.fps, 544 + _Data.main.x, 16 + _Data.main.y);
	}, 
	start: function () {
		var date = new Date();
		gl.ms = date.getTime();
		Anim.handle = _Tools.setInterval.call(Anim, Anim.changeFrame, 200);
		setInterval(function () {


			gl.render();
			gl.lowLayerRender()
			gl.effectsRender()
			gl.animationRender()
			gl.emittersRender()
			gl.messageRender()
			if (Outputs.on) {
				gl.outputsRender()
			}
			gl.fpsTimer()
			gl.postRender()
		}, 33);
	},
	map: function () {
		_Map.grid.forEach(function (xArr) {
			xArr.forEach(function (cell) {
				map.drawImage(cell.object.image.pic,
							cell.object.image.pos.x,
							cell.object.image.pos.y,
							32,
							32,
							cell.x + _Data.main.x,
							cell.y + _Data.main.y,
							32,
							32
							);
			});
		});
	},
	animationRender: function () {
		this.anim.forEach(function (buffer) {
			map.drawImage(buffer.img,
						buffer.frames[buffer.curFrame].x,
						buffer.frames[buffer.curFrame].y,
						buffer.frames[buffer.curFrame].w,
						buffer.frames[buffer.curFrame].h,
						buffer.pos.x + _Data.main.x,
						buffer.pos.y + _Data.main.y,
						buffer.frames[buffer.curFrame].w,
						buffer.frames[buffer.curFrame].h
						);
		});
	},
	messageRender: function () {
		gl.mess.forEach(function (buf) {
			var pos = buf.getPos()
			map.fillStyle = 'rgba(' + buf.color + ', 1)';
			var font = ""
			if (buf.bold) {
				font += "bold "
			};
			font += buf.size + 'px Arial'
			map.font = font;
			map.textAlign = buf.textAlign
			map.textBaseline = buf.baseLine;
			map.fillText(buf.getText(), pos.x, pos.y + buf.offsetY);
		});
	},
	outputsRender: function () {
		gl.outputs.forEach(function (buf) {
			switch (buf.type) {
				case 'text':
					var pos = buf.getPos()
					map.fillStyle = 'rgba(' + buf.color + ', 1)';
					var font = ""
					if (buf.bold) {
						font += "bold "
					};
					font += buf.size + 'px Arial'
					map.font = font;
					map.textAlign = buf.textAlign
					map.textBaseline = buf.baseLine;
					map.fillText(buf.getText(), pos.x, pos.y);
				break

				case 'image':
					var pos = buf.getPos()
					for (var i = 0; i < buf.repeat(); i++) {
						map.drawImage(	buf.img,
										buf.imgX,
										buf.imgY,
										buf.imgW,
										buf.imgH,
										pos.x + i * buf.w,
										pos.y,
										buf.w,
										buf.h
										)
					}
				break
			}
		})
	},
	effectsRender: function () {
		this.effects.forEach(function (effect) {
			effect.particles.forEach(function (particle) {
				map.drawImage(
					particle.parent.img,
					0,
					0,
					32,
					32,
					particle.parent.x + particle.x,
					particle.parent.y + particle.y,
					particle.size,
					particle.size
					)
			})
		})
	},
	postRender: function () {
		map.drawImage(Imgs.elt, 0, 0, 672, 672, 0, 0, 672, 672)
	},
	lowLayerRender: function () {
		this.lowLayer.forEach(function (buf) {
			buf.picArr.forEach(function (pic) {

			map.drawImage(	buf.img,
							pic.x,
							pic.y,
							pic.w,
							pic.h,
							pic.pos.x,
							pic.pos.y,
							pic.pos.w,
							pic.pos.h
							)
			})
		})
	},
	highLayerRender: function () {
		this.highLayer.forEach(function (buf) {
			buf.picArr.forEach(function (pic) {

			map.drawImage(	buf.img,
							pic.x,
							pic.y,
							pic.w,
							pic.h,
							pic.pos.x,
							pic.pos.y,
							pic.pos.w,
							pic.pos.h
							)
			})
		})
	},
	emittersRender: function () {
		this.emitters.forEach(function (emitter) {
			emitter.particles.forEach(function (particle) {
				map.drawImage(
					particle.parent.img,
					0,
					0,
					32,
					32,
					particle.x + Math.floor(particle.size / 2) * -1 + particle.parent.pos.x,
					particle.y + Math.floor(particle.size / 2) * -1 + particle.parent.pos.y,
					particle.size,
					particle.size
					)
			})
		})
	},
	shopRender: function () {
		if (Shop.on) {
			map.fillStyle = Shop.background.color
			map.fillRect(Shop.background.x, Shop.background.y, Shop.background.w, Shop.background.h)

			map.fillStyle = Shop.header.color
			map.font = Shop.header.font
			map.textAlign = Shop.header.textAlign;
			map.textBaseline = Shop.header.textBaseline;
			map.fillText(Shop.header.text, Shop.header.x, Shop.header.y)

			map.fillStyle = Shop.mess.color
			map.font = Shop.mess.font
			map.textAlign = Shop.mess.textAlign;
			map.textBaseline = Shop.mess.textBaseline;
			map.fillText(Shop.mess.text, Shop.mess.x, Shop.mess.y)

			Shop.data.catalog.products.forEach(function (product, i) {
				map.drawImage(	product.icon,
								Shop.product.icon.x,
								Shop.product.icon.y,
								Shop.product.icon.w,
								Shop.product.icon.h,
								Shop.background.x + Shop.data.catalog.x,
								Shop.background.y + Shop.data.catalog.y + i * Shop.product.h,
								Shop.product.icon.w,
								Shop.product.icon.h)

				map.fillStyle = Shop.product.title.color
				map.font = Shop.product.title.font
				map.textAlign = Shop.product.title.textAlign
				map.textBaseline = Shop.product.title.textBaseline
				map.fillText(product.name, Shop.background.x + Shop.data.catalog.x + Shop.product.title.x,
										 Shop.background.y + Shop.data.catalog.y + i * Shop.product.h + Shop.product.title.y)

				map.fillStyle = Shop.product.price.color
				map.font = Shop.product.price.font
				map.textAlign = Shop.product.price.textAlign
				map.textBaseline = Shop.product.price.textBaseline
				map.fillText(product.price, Shop.background.x + Shop.data.catalog.x + Shop.product.price.x,
										  Shop.background.y + Shop.data.catalog.y + i * Shop.product.h + Shop.product.price.y)
				if (product.type == 'skill') {
					for (var j = 0; j < 10; j++) {
						var style;
						if (j + 1 > product.object.level) {
							style = 'red'
						} else {
							style = 'green'
						}
						map.fillStyle = style
						map.fillRect(	Shop.background.x + Shop.data.catalog.x + Shop.product.level.x + j * Shop.product.level.w,
										Shop.background.y + Shop.data.catalog.y + i * Shop.product.h + Shop.product.level.y,
										Shop.product.level.w - Shop.product.level.marginLeft,
										Shop.product.level.h)
					}
				};
			})

			map.drawImage(	
							Imgs.cursor,
							Shop.cursor.img.x,
							Shop.cursor.img.y,
							Shop.cursor.img.w,
							Shop.cursor.img.h,
							Shop.background. x + Shop.cursor.x,
							Shop.background. y + Shop.cursor.y,
							Shop.cursor.w,
							Shop.cursor.h
						)

			map.fillStyle = color.white
			map.font = "20px Arial";
			map.textAlign = "center";
			map.textBaseline = "bottom";
			map.fillText("Press enter to continue, Press space to buy", 336, Shop.background.y + Shop.background.h - 10)
		}
	}
};