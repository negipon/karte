var express = require('express');
var router = express.Router();
var connection = require('../db/index.js');

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
		res.render('users', { title: 'Users', user:req.user, users:rows });
	});
});

module.exports = router;
