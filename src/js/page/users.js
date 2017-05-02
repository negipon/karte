var KARTE = KARTE || {};
KARTE.USER = {};
KARTE.USER.upload = {
	init: function () {
		this.setParameters();
		this.bindEvent();
	},
	setParameters: function() {
		this.$uploadFile = $('.jsc-upload-file');
		this.$userDelete = $('.jsc-user-delete');
		this.$uploadValue = $('#jsi-upload-value');
	},
	bindEvent: function() {
		var _self = this;
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
		this.$userDelete.on('click', function(e) {
			e.preventDefault();
			_self.userDelete($(this).attr('href'));
		});
	},
	userDelete: function(targetUrl) {
		$.ajax({
			type: 'POST',
			url: targetUrl,
			success: function(data){
				location.href = '../';
			}
		});

	}
};
KARTE.USER.upload.init();
