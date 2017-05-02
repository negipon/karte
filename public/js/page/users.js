var KARTE = KARTE || {};
KARTE.USER = {};
KARTE.USER.upload = {
	init: function () {
		this.setParameters();
		this.bindEvent();
	},
	setParameters: function() {
		this.$target = $('.jsc-upload');
	},
	bindEvent: function() {
		this.$target.on('submit', function(e) {
			e.preventDefault();
		});
	}
};
KARTE.USER.upload.init();
