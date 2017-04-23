'use strict';

var express = require('express');
var router = express.Router();
var passport = require('passport');
var flash = require('connect-flash');

router.get('/',
	function(req, res, next) {
	res.render('login', {
		title: 'Login',
		user:req.user,
		error: req.flash('error'),
		input_id: req.flash('input_id'),
		input_password: req.flash('input_password')
	});
});

router.post('/',
	passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/login',
		failureFlash: true
	}),
	function(req, res, next) {
		res.render('login', {
			title: 'Login', user:req.user
		});
	}
);
module.exports = router;
