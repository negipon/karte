var express = require('express');
var router = express.Router();
var connection = require('../db/index.js');
var multer = require('multer');
var crypto = require('crypto');
var path = require('path');

// リクエストがあったとき、ログイン済みかどうか確認する関数
var isLogined = function(req, res, next){
	if(req.isAuthenticated())
		return next();  // ログイン済み
	// ログインしてなかったらログイン画面に飛ばす
	res.redirect('/login');
};

var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './public/uploads/avatar');
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname);
	}
});

var upload = multer({ storage: storage }).single('avatar');

var getHash = function(value) {
	var sha = crypto.createHmac('sha256', 'secretKey');
	sha.update(value);
	return sha.digest('hex');
};

/* GET users listing. */
router.get('/', isLogined, function(req, res, next) {
	var sort = req.query.sort;
	if (!sort) {
		sort = 'ASC';
	}
	connection.query('SELECT * FROM users INNER JOIN authority ON users.authorityId = authority.authorityId ORDER BY number ' + sort, function (err, rows) {
		res.render('skillsheet', {
			title: 'Skill Sheet List',
			page: 'users',
			user: req.user,
			users:rows
		});
	});
});

/* Add users. */
router.get('/add', isLogined, function(req, res, next) {
	connection.query('SELECT * FROM users', function (err, usersRows) {
		connection.query('SELECT * FROM authority ORDER BY authorityId ASC', function (err, authorityRows) {
			res.render('skillsheet-detail', {
				title: 'Add Skill Sheet',
				page: 'users',
				user: req.user,
				users: usersRows,
				authority: authorityRows
			});
		});
	});
});

/* Add users. */
router.post('/add', isLogined, function(req, res, next) {
	upload(req, res, function(err) {
		if(err) {
			console.log('Error Occured');
			return;
		}
		var profile = req.body;
		var insertProfile = {
			number: profile.number,
			authorityId: profile.authority,
			username: profile.username,
			password: getHash(profile.password),
			displayName: profile.displayName,
			email: profile.email,
			favorite: profile.favorite,
			birthday: profile.birthday,
			hireDate: profile.hireDate,
			bloodType: profile.bloodType,
			tel: profile.tel,
			gender: profile.gender
		};
		if (req.file) {
			insertProfile.avatarFile = req.file.filename;
		}
		connection.query('INSERT INTO users SET ?', insertProfile, function (err, rows) {
			if (err) {
				res.send('Failed');
			} else {
				res.redirect('/users');
			}
		});
	});
});

/* Edit. */
router.get('/edit/:id', isLogined, function(req, res, next) {
	var id = req.params.id;
	connection.query('SELECT * FROM users WHERE number = ' + id, function (err, usersRows) {
		connection.query('SELECT * FROM skillsheet WHERE userNumber = ' + id, function (err, skillsheetRows) {
			connection.query('SELECT * FROM skillCategory', function (err, skillCategoryRows) {
				connection.query('SELECT * FROM skill', function (err, skillRows) {
					connection.query('SELECT * FROM progress WHERE userNumber = ' + id, function (err, progressRows) {
						connection.query('SELECT * FROM history WHERE userNumber = ' + id, function (err, historyRows) {
							res.render('skillsheet-detail', {
								title: 'Edit Skill Sheet',
								page: 'skill-edit',
								user: req.user,
								users: usersRows[0],
								skillsheet: skillsheetRows[0],
								history: historyRows,
								skillCategory: skillCategoryRows,
								skill: skillRows,
								progress: progressRows
							});
						});
					});
				});
			});
		});
	});
});

router.post('/edit/', isLogined, function(req, res, next) {
	upload(req, res, function(err) {
		if(err) {
			console.log('Error Occured');
			return;
		}
		var skill = req.body;
		var progress = '';
		var history = '';
		var historyNull = '';
		var historyId = '';
		var historyUpdate = '';
		var historyColumn = '(`historyId`,`userNumber`';
		var id = skill.id;
		var historyNullFlag = skill.historyNullFlag;
		var updateSkillSheet = {
			education: skill.education,
			qualification: skill.qualification,
			specialty: skill.specialty,
			updateDate: new Date()
		};
		for (key in skill) {
			if (key.startsWith('progress-')) {
				var progressCode = key.replace('progress-', '').split('-');
				progress += "('" + progressCode[0] + "','" + id + "','" + progressCode[1] + "','" + skill[key] + "'),";
			} else if (key.startsWith('history-null')) {
				var historyCode = key.replace('history-', '').split('-');

				if (historyColumn.indexOf(historyCode[1]) === -1) {
					historyColumn += ',`' + historyCode[1] + '`';
					historyUpdate += historyCode[1] + ' = VALUES(`' + historyCode[1] + '`),';
				}

				if (historyNullFlag > 0 && historyId !== historyCode[0]) {
					historyId = historyCode[0];
					history += "),('" + historyCode[0] + "','" + id + "','" + skill[key] + "'";
				} else if (historyNullFlag > 0) {
					history += ",'" + skill[key] + "'";
				}

			} else if (key.startsWith('history-')) {
				var historyCode = key.replace('history-', '').split('-');
				if (!historyId) {
					historyId = historyCode[0];
					history = "('" + historyCode[0] + "','" + id + "','" + skill[key] + "'";
					historyColumn += ',`' + historyCode[1] + '`';
				} else if (historyId !== historyCode[0]) {
					historyId = historyCode[0];
					history += "),('" + historyCode[0] + "','" + id + "','" + skill[key] + "'";
				} else {
					history += ",'" + skill[key] + "'";
				}
			}
		}
		history += ')';
		historyColumn += ')';
		connection.query('UPDATE skillsheet SET ? WHERE userNumber = ' + id, updateSkillSheet, function (err, rows) {

			if (err) { res.send('Failed skillsheet'); }

			connection.query('INSERT INTO `progress` (`progressId`, `userNumber`, `skillId`, `progressValue`) VALUES ' + progress.substr(0,progress.length-1) + ' ON DUPLICATE KEY UPDATE progressValue = VALUES(`progressValue`)', function (err, rows) {

				if (err) { res.send('Failed progress'); }

				connection.query('INSERT INTO `history` ' + historyColumn + ' VALUES ' + history + ' ON DUPLICATE KEY UPDATE ' + historyUpdate.substr(0,historyUpdate.length-1), function (err, rows) {

					if (err) { res.send('Failed history'); }
					else {
						res.redirect('/skillsheet/edit/' + id);
					}

				});

			});
		});
	});
});
router.post('/edit/delete', function(req, res, next) {
	var id = req.query.id;
	connection.query('DELETE FROM users WHERE number = ' + id, function (err, rows) {
		if (err) {
			res.send('Failed');
		} else {
			res.redirect('/users/');
		}

	});
});
router.post('/history/delete', function(req, res, next) {
	var id = req.query.id;
	connection.query('DELETE FROM history WHERE historyId = ' + id, function (err, rows) {
		if (err) {
			res.send('Failed');
		}
	});
});

module.exports = router;
