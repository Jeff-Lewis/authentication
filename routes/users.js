var express = require('express');
var router = express.Router();
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
var Twitter = require('twitter-node-client').Twitter;
var config = require('../utils/config.js');

/* GET users listing. */
router.get('/',
    ensureLoggedIn('/auth/twitter'),
    function(req, res, next) {
        var _twitter = new Twitter(config.configtwitter);

        _twitter.getHomeTimeline({ count: '10', page: 1},
            function (err, response, body) {
                console.log(err);
                var message = err.data;
                var code = err.data.statusCode;
                var stack = err.data;
                error = {
                    status: code,
                    stack: stack
                };
                res.render('error', { message: message, error: error });
            },
                function (data) {
                    var listtwitter = JSON.parse(data);
                    res.render('users', { listtwitter:listtwitter});
            });
});

module.exports = router;
