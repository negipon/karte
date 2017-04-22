var express = require('express');
var router = express.Router();
var passport = require('passport');

router.get('/',
  function(req, res, next) {
  res.render('login', { title: 'Login', user:req.user });
});

router.post('/',
  passport.authenticate('local', {
   failureRedirect: '/login'
  }),
  function(req, res, next) {
  	res.render('login', { title: 'Login', user:req.user });
  }
);
module.exports = router;
