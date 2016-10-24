var Mess = {
	handles: [],
	speed: 20,
	lib: {},
	place: {
		centerMessage: {
			type: 0,
			color: color.white,
			size: 26,
			baseLine: "top",
			textAlign: "center",
			bold: true,
			offsetY: 0,
			getPos: function () {
				var pos = {
					x: 336,
					y: 352
				}
				return pos
			}
		},
		soundMessage: {
			type: 1,
			color: color.white,
			size: 50,
			baseLine: "top",
			textAlign: "center",
			bold: true,
			offsetY: 0,
			getPos: function () {
				var pos = {
					x: 336,
					y: 288
				}
				return pos
			}
		},
		pointsMessage: {
			type: 2,
			color: color.white,
			size: 18,
			baseLine: "bottom",
			textAlign: "center",
			bold: false,
			offsetY: 32,
			getPos: function () {
				return {
					x: Player.pos.x + 16,
					y: Player.pos.y + 16
				}
			}
		}
	},
	init: function () {
		this.addMessage('pressEnter', 'centerMessage', false, function () {
			return 'press Enter'
		})
		this.addMessage('pressSpace', 'centerMessage', false, function () {
			return 'press Space'
		})
		this.addMessage('gameOver', 'centerMessage', false, function () {
			return 'Game Over'
		})
		this.addMessage('pause', 'centerMessage', false, function () {
			return 'pause'
		})
		this.addMessage('enterKeyword', 'centerMessage', false, function () {
			return 'enter Keyword!'
		})
		this.addMessage('keyword', 'soundMessage', false, function () {
			return Events.finishHim.word
		})
		this.addMessage('doublekill', 'soundMessage', 1000, function () {
			return 'Double kill!'
		})
		this.addMessage('multikill', 'soundMessage', 1000, function () {
			return 'Multi kill!'
		})
		this.addMessage('megakill', 'soundMessage', 1000, function () {
			return 'Mega kill!'
		})
		this.addMessage('killingspree', 'soundMessage', 1000, function () {
			return 'Killing spree!'
		})
		this.addMessage('rampage', 'soundMessage', 1000, function () {
			return 'Rampage!'
		})
		this.addMessage('dominating', 'soundMessage', 1000, function () {
			return 'Dominating!'
		})
		this.addMessage('unstoppable', 'soundMessage', 1000, function () {
			return 'Unstoppable!'
		})
		this.addMessage('godlike', 'soundMessage', 1000, function () {
			return 'Godlike!'
		})
		this.addMessage('headShot', 'soundMessage', 1000, function () {
			return 'Headshot!'
		})
		this.addMessage('headHunter', 'soundMessage', 1000, function () {
			return 'Headhunter!'
		})
		this.addMessage('firstblood', 'soundMessage', 1000, function () {
			return 'Firstblood!'
		})
		this.addMessage('level', 'centerMessage', 4000, function () {
			return 'Level: ' + _Data.level
		})
	},
	addMessage: function (name, place, ms, getText) {
		this.lib[name] = new Message(place, ms, getText)
	},
	setMess: function (mess, pos) {
		if (mess in Mess.lib) {
			this.addMessageBuffer(Mess.lib[mess].place,
								  Mess.lib[mess].getText, 
								  Mess.lib[mess].ms,
								  mess,
								  pos)
		} else {
			this.addMessageBuffer('pointsMessage', function () {return mess}, false, mess, pos)
		}
	},
	addMessageBuffer: function (place, getText, ms, mess, pos) {
		gl.mess.forEach(function (buf, i) {
			if (buf.type == Mess.place[place].type && buf.type != 2) {
				gl.mess.splice(i, 1)
			};
		})
		var getPos;
		if (pos != undefined) {
			var x = pos.x + 16
			var y = pos.y + 16
			getPos = function () {
				return {
					x: x,
					y: y
				}
			}
		} else {
			getPos = Mess.place[place].getPos
		}

		var messageBuffer = new MessageBuffer(

				getText,
				Mess.place[place].color,
				Mess.place[place].size,
				Mess.place[place].baseLine,
				Mess.place[place].textAlign,
				Mess.place[place].bold,
				getPos,
				Mess.place[place].offsetY,
				Mess.place[place].type

			)
		gl.mess.push(messageBuffer)
		if (mess in Mess.lib) {
			Mess.lib[mess].messageBuffer = messageBuffer
		}
		if (ms) {
			var handle = _Tools.setTimeout.call(this, function () {
				Mess.removeMessageBuffer(this)
			}.bind(messageBuffer), ms)
			this.handles.push(handle)
		}
		if (Mess.place[place].type == 2) {
			messageBuffer.handle = _Tools.setInterval.call(messageBuffer, function () {
				if (this.offsetY == 0) {
					_Tools.clearInterval(this.handle)
					Mess.removeMessageBuffer(this)
				};
				this.offsetY -= 2
			}.bind(messageBuffer), this.speed)
		};
	},
	removeMessageBuffer: function (messageBuffer) {
		for (var i = 0; i < gl.mess.length; i++) {
			if (gl.mess[i].id == messageBuffer.id) {
				gl.mess.splice(i, 1)
				return
			};
		}
	},
	hideMess: function (mess) {
		this.removeMessageBuffer(this.lib[mess].messageBuffer)
	}
}

var Outputs = {
	on: true,
	handles: [],
	lib: {
		scope: {
			type: 'text',
			getText: function () {
				return "Scope: " + _Data.scope
			},
			getPos: function () {
				return {
					x: 64,
					y: 16
				}
			},
			outputBuffer: null
		},
		level: {
			type: 'text',
			getText: function () {
				return "Level: " + _Data.level
			},
			getPos: function () {
				return {
					x: 192,
					y: 16
				}
			},
			outputBuffer: null
		},
		lifes: {
			type: "image",
			img: null,
			imgX: 32,
			imgY: 64,
			imgW: 32,
			imgH: 32,
			getPos: function () {
				return {
					x: 320,
					y: 8
				}
			},
			w: 16,
			h: 16,
			repeat: function () {
				return _Data.lifes
			}
		}
	},
	types: {
		text: {
			type: 'text',
			baseLine: "middle",
			textAlign: "left",
			bold: true,
			size: 18,
			color: color.white
		}
	},
	init: function () {
		Outputs.lib.lifes.img = Imgs.pacman
		for (output in Outputs.lib) {
			this.addOutputBuffer(Outputs.lib[output])
		}
	},
	addOutputBuffer: function (output) {
		switch (output.type) {
			case 'text':
				output.outputBuffer = new OutputTextBuffer(
						output.getText,
						Outputs.types.text.color,
						Outputs.types.text.size,
						Outputs.types.text.baseLine,
						Outputs.types.text.textAlign,
						Outputs.types.text.bold,
						output.getPos,
						Outputs.types.text.type
					)
			break

			case 'image':
				output.outputBuffer = new OutputImageBuffer(
						output.type,
						output.img,
						output.imgX,
						output.imgY,
						output.imgW,
						output.imgH,
						output.getPos,
						output.w,
						output.h,
						output.repeat
					)
			break
		}

		gl.outputs.push(output.outputBuffer)
	}
}