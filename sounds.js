var Sounds = {
	on: false,
	mess: '',
	update: false,
	show_mess: function (mess) {
		if (Sounds.on) {
			Sounds.update = true
		}

		this.mess = mess
		this.on = true

		setTimeout(function () {
			if (Sounds.update) {
				Sounds.update = false
				return
			}

			Sounds.on = false
			Sounds.mess = ''
		}, 1000)
	}
};