var KARTE = KARTE || {};
KARTE.USER = {};
KARTE.USER.upload = {
	init: function () {
		this.setParameters();
		this.bindEvent();
	},
	setParameters: function() {
		this.$target = $('.jsc-upload-form');
		this.$input = this.$target.find('input');
		this.$uploadImage = $('.jsc-upload-image');
		this.$uploadFile = $('.jsc-upload-file');
		this.$uploadValue = $('#jsi-upload-value');
	},
	bindEvent: function() {
		var _self = this;
		this.$target.on('submit', function(e) {
			for (var i = 0; i < _self.$input.length; i++) {
				console.log(_self.$input.eq(i).val());
			}
			// _self.postAjax();
			// return false;
		});
		this.$uploadFile.on('change', function() {
			var file = $(this)[0].files;
			var reg = /(.*)(?:\.([^.]+$))/;
			if (file.length > 0) {
				for (var i = 0; i < file.length; i++) {
					var fileName = file[i].name.match(reg)[1];
					var fileTyle = file[i].name.match(reg)[2];
				}
			}
			_self.$uploadValue.val(fileName + '.' + fileTyle);
		});
	},
	postAjax: function() {
		$.ajax({
			url: '/users/upload',
			type: 'POST',
			timeout: 5000,
			success: function(data){
				console.log(data);
			},
			error: function(){
				console.log('Failed to write');
			}
		})
	}
};
KARTE.USER.upload.init();
