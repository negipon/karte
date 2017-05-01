var express = require('express');
var router = express.Router();
var connection = require('../db/index.js');
var multer = require('multer');

var upload = multer({ dest: './uploads/' }).single('thumbnail');

router.post('/upload', function(req, res) {
	upload(req, res, function(err) {
		if(err) {
			res.send('Failed to write ' + req.file);
		} else {
			res.send('uploaded ' + req.file.originalname + ' as ' + req.file.filename + ' Size: ' + req.file.size);
		}
	});
});

// リクエストがあったとき、ログイン済みかどうか確認する関数
var isLogined = function(req, res, next){
	if(req.isAuthenticated())
		return next();  // ログイン済み
	// ログインしてなかったらログイン画面に飛ばす
	res.redirect('/login');
};

/* GET users listing. */
router.get('/', isLogined, function(req, res, next) {
	connection.query('select * from users', function (err, rows) {
		res.render('users', {
			title: 'Users',
			user:req.user,
			users:rows
		});
	});
});

/* Add users. */
router.get('/add', isLogined, function(req, res, next) {
	connection.query('select * from users', function (err, rows) {
		res.render('users-add', {
			title: 'Add Users',
			user:req.user,
			users:rows
		});
	});
});


module.exports = router;
