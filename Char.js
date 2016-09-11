var Char = {

	playerInit: function (character) {
		Player = new _Player()
		Player.__proto__ = character;
		Player.setDefault()
	},

	enemiesInit: function (character) {
		var aiPrototype = new AIPrototype();
		aiPrototype.__proto__ = character

		Blinky = new _Enemy(0, {x: 320, y: 224}, Anim.lib.blinky, 'passive')
		Blinky.__proto__ = aiPrototype
		Blinky.setDefault()

		Pinky = new _Enemy(1, {x: 320, y: 288}, Anim.lib.pinky, 'in_room')
		Pinky.__proto__ = aiPrototype
		Pinky.setDefault()

		Bob = new _Enemy(2, {x: 288, y: 288}, Anim.lib.bob, 'in_room')
		Bob.__proto__ = aiPrototype
		Bob.setDefault()

		Paul = new _Enemy(3, {x: 352, y: 288}, Anim.lib.paul, 'in_room')
		Paul.__proto__ = aiPrototype
		Paul.setDefault()

		enemyArr.push(Blinky, Pinky, Bob, Paul)
	}
}