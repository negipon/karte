var connection = require('./index.js');
var query = 'SELECT * FROM users INNER JOIN authority ON users.authorityId = authority.authorityId';

exports.findById = function(id, cb) {
	connection.query(query + ' WHERE id = ' + id, function (err, rows) {
		process.nextTick(function() {
			if (rows[0]) {
				cb(null, rows[0]);
			} else {
				cb(new Error('User ' + id + ' does not exist'));
			}
		});
	});
}
exports.findByUsername = function(username, cb) {
	connection.query(query + ' ORDER BY id ASC', function (err, rows) {
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
