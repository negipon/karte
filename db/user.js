var connection = require('./index.js');
var query = 'SELECT * FROM users INNER JOIN authority ON users.authorityId = authority.authorityId ORDER BY id ASC';

exports.findById = function(id, cb) {
	connection.query(query, function (err, rows) {
		process.nextTick(function() {
			var idx = id - 1;
			if (rows[idx]) {
				cb(null, rows[idx]);
			} else {
				cb(new Error('User ' + id + ' does not exist'));
			}
		});
	});
}
exports.findByUsername = function(username, cb) {
	connection.query(query, function (err, rows) {
		process.nextTick(function() {
			for (var i = 0, len = rows.length; i < len; i++) {
				var record = rows[i];
				if (record.username === username) {
					return cb(null, record);
				}
			}
			return cb(null, null);
		});
	});
}
