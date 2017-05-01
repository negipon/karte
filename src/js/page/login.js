var KARTE = KARTE || {};
KARTE.LOGIN = {};
KARTE.LOGIN.upload = {
	init: function () {
		this.setParameters();
		this.bindEvent();
	},
	setParameters: function() {
		this.$target = $('.jsc-target');
	},
	bindEvent: function() {
		this.$target.on('click', function() {

		});
	}
};
KARTE.LOGIN.upload.init();
