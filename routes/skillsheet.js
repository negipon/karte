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
					connection.query('SELECT * FROM skillProgress WHERE userNumber = ' + id, function (err, skillProgressRows) {
						connection.query('SELECT * FROM history WHERE userNumber = ' + id, function (err, historyRows) {
							res.render('skillsheet-detail', {
								title: 'Edit Skill Sheet',
								page: 'edit',
								user: req.user,
								users: usersRows[0],
								skillsheet: skillsheetRows[0],
								history: historyRows,
								skillCategory: skillCategoryRows,
								skill: skillRows,
								skillProgress: skillProgressRows
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
		console.log(skill);
		var id = skill.id;
		var updateSkillSheet = {
			education: skill.education,
			qualification: skill.qualification,
			specialty: skill.specialty
		};
		connection.query('UPDATE skillsheet SET ? WHERE userNumber = ' + id, updateSkillSheet, function (err, rows) {
			if (err) {
				res.send('Failed');
			} else {
				res.redirect('/skillsheet/edit/' + id);
			}

		});
	});
});
router.post('/edit/delete', function(req, res, next) {
	var id = req.query.id;
	connection.query('DELETE FROM users WHERE id = ' + id, function (err, rows) {
		if (err) {
			res.send('Failed');
		} else {
			res.redirect('/users/');
		}

	});
});

module.exports = router;
