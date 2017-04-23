var express = require('express');
var router = express.Router();

// リクエストがあったとき、ログイン済みかどうか確認する関数
var isLogined = function(req, res, next){
	if(req.isAuthenticated())
		return next();  // ログイン済み
	// ログインしてなかったらログイン画面に飛ばす
	res.redirect('/login');
};

/* GET home page. */
router.get('/', isLogined, function(req, res, next) {
	res.render('index', { title: 'Express', user:req.user });
});

module.exports = router;
