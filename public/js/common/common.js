var KARTE = KARTE || {};
KARTE.INPUT = {
	init: function () {
		this.setParameters();
		this.bindEvent();
	},
	setParameters: function() {
		this.$target = $('.jsc-input');
	},
	bindEvent: function() {
		var _self = this
		for (var i = 0; i < this.$target.length; i++) {
			_self.check(this.$target.eq(i));
		}
		this.$target.on('keyup', function() {
			_self.check($(this));
		});
		this.$target.on('blur', function() {
			_self.check($(this));
		});
	},
	check: function(_self) {
		if (_self.val().length) {
			_self.addClass('is-inputted');
		} else {
			_self.removeClass('is-inputted');
		}
	}
};
KARTE.INPUT.init();
