var KARTE = KARTE || {};
KARTE.INDEX = {};
KARTE.INDEX.upload = {
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
KARTE.INDEX.upload.init();
