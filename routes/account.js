var express = require('express');
var router = express.Router();
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

/* GET home page. */
router.get('/',
  ensureLoggedIn('/auth/twitter'),
  function(req, res) {
    var description = req.user._json.description;
    var location = req.user._json.location;
    res.render('account', {description:description, location:location });
  });

module.exports = router;