var connection = require('./index.js');

connection.query('select * from users', function (err, rows) {
	exports.findById = function(id, cb) {
		process.nextTick(function() {
			var idx = id - 1;
			if (rows[idx]) {
				cb(null, rows[idx]);
			} else {
				cb(new Error('User ' + id + ' does not exist'));
			}
		});
	}
	exports.findByUsername = function(username, cb) {
		process.nextTick(function() {
			for (var i = 0, len = rows.length; i < len; i++) {
				var record = rows[i];
				if (record.username === username) {
					return cb(null, record);
				}
			}
			return cb(null, null);
		});
	}
});
