var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var crypto = require('crypto');
var flash = require('connect-flash');

// ルート設定
var routes = require('./routes/index');
var users = require('./routes/users');
var login = require('./routes/login');

var app = express();

var connection = require('./db/');
var dbuser = require('./db/user');

// 暗号化
var getHash = function(value) {
	var sha = crypto.createHmac('sha256', 'secretKey');
	sha.update(value);
	return sha.digest('hex');
};

// セッションミドルウェア設定
app.use(session({ resave:false, saveUninitialized:false, secret: 'keyboar cat' }));
app.use(flash());
// 認証ミドルウェアpassportの初期化。
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
	{
		usernameField: 'username',
		passwordField: 'password',
		passReqToCallback: true
	},
	function(req, username, password, done) {
	dbuser.findByUsername(username, function(err, user) {
		if (err) {
			return done(err);
		}

		if (!user) {
			req.flash('error', 'ユーザーが見つかりませんでした。');
			req.flash('input_id', username);
			req.flash('input_password', password);
			return done(null, false);
		}

		var hashedPassword = getHash(password);
		console.log(hashedPassword);
		if (user.password != hashedPassword
			&& user.password != password) {
				req.flash('error', 'パスワードが間違っています。');
				req.flash('input_id', username);
				req.flash('input_password', password);
				return done(null, false);
			}
			return done(null, user);
		});
	}
));

// Configure Passport authenticated session persistence.
passport.serializeUser(function(user, cb) {
	cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
	dbuser.findById(id, function (err, user) {
		if (err) {
			return cb(err);
		}
		cb(null, user);
	});
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ルーティング設定
app.use('/', routes);
app.use('/users', users);
app.use('/login', login);
app.get('/logout', function(req, res){
	req.logout();
	res.redirect('/');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});

module.exports = app;
