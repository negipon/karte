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

// var upload = multer({ dest: './public/uploads/avator' }).single('avatar');

var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './public/uploads/avator');
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname + '-' + Date.now() + path.extname(file.originalname));
	}
});

var upload = multer({ storage: storage }).single('avatar');

var getHash = function(value) {
	var sha = crypto.createHmac('sha256', 'secretKey');
	sha.update(value);
	return sha.digest('hex');
};

router.post('/upload', function(req, res, next) {
	var fileName = req.body.uploadValue;
	upload(req, res, function(err) {
	  if(err) {
	    console.log('Error Occured');
	    return;
	  }
	  console.log(fileName);
	next();
  })
});

/* GET users listing. */
router.get('/', isLogined, function(req, res, next) {
	connection.query('SELECT * FROM users', function (err, rows) {
		res.render('users', {
			title: 'Users',
			page: 'users',
			user:req.user,
			users:rows
		});
	});
});

/* Add users. */
router.get('/add', isLogined, function(req, res, next) {
	connection.query('SELECT * FROM users', function (err, usersRows) {
		connection.query('SELECT * FROM authority', function (err, authorityRows) {
			res.render('users-add', {
				title: 'Add Users',
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
	var profile = req.body;
	var insertProfile = {
		number: profile.number,
		authorityId: profile.authority,
		username: profile.username,
		password: getHash(profile.password),
		displayName: profile.dispayName,
		email: profile.email
	};
	connection.query('INSERT INTO users SET ?', insertProfile, function (err, rows) {
		if (err) {
			res.send('Failed');
		} else {
			res.redirect('/users');
		}

	});
});

/* Add users. */
router.get('/edit/:id', isLogined, function(req, res, next) {
	var id = req.params.id;
	connection.query('SELECT * FROM users WHERE id = ' + id, function (err, usersRows) {
		connection.query('SELECT * FROM authority ORDER BY authorityId ASC', function (err, authorityRows) {
			res.render('users-add', {
				title: 'Edit Users',
				page: 'users',
				user: req.user,
				users: usersRows[0],
				authority: authorityRows
			});
		});
	});
});

router.post('/edit/', isLogined, function(req, res, next) {
	var profile = req.body;
	var id = profile.id;
	var updateProfile = {
		number: profile.number,
		authorityId: profile.authority,
		username: profile.username,
		displayName: profile.displayName,
		email: profile.email
	};
	if (profile.password) {
		updateProfile.password = getHash(profile.password);
	}
	connection.query('UPDATE users SET ? WHERE id = ' + id, updateProfile, function (err, rows) {
		if (err) {
			res.send('Failed');
		} else {
			res.redirect('/users/edit/' + id);
		}

	});
});

module.exports = router;
