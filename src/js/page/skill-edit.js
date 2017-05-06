var KARTE = KARTE || {};
KARTE.USER = {};
KARTE.USER.skillEdit = {
	init: function () {
		this.setParameters();
		this.bindEvent();
	},
	setParameters: function() {
		this.$nullHistory = $('.jsc-history-null');
		this.$historyDelete = $('.jsc-history-delete');
		this.$nullHistoryFlag = $('#jsi-history-null-flag');
		this.$nullInput = this.$nullHistory.find('input, textarea');
		this.nullArray = [];
	},
	bindEvent: function() {
		var _self = this;
		this.$nullInput.on('change', function(){
			_self.nullArray = [];
			for (var i = 0; i < _self.$nullInput.length; i++) {
				_self.nullArray.push(_self.$nullInput.eq(i).val().length);
			}
			if (_self.sum(_self.nullArray) > 0) {
				_self.$nullHistoryFlag.val('1');
			} else {
				_self.$nullHistoryFlag.val('0');
			}
		});
		this.$historyDelete.on('click', function(e) {
			e.preventDefault();
			var parent = $(this).closest('.jsc-history-row');
			_self.historyDelete($(this).attr('href'));
			parent.fadeOut(500, function(){
				parent.remove();
			});
		});
	},
	sum: function(arr) {
		var sum = 0;
		arr.forEach(function(elm) {
			sum += elm;
		});
		return sum;
	},
	historyDelete: function(targetUrl) {
		$.ajax({
			type: 'POST',
			url: targetUrl,
			success: function(data){
				location.href = './';
			}
		});

	}
};
KARTE.USER.skillEdit.init();
