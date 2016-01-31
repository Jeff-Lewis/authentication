var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var account = require('./routes/account');

var app = express();
var config = require('./utils/config.js');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret:'secret',
  resave:true,
  saveUninitialized:true
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new TwitterStrategy({
    consumerKey: config.configtwitter.consumerKey,
    consumerSecret:  config.configtwitter.consumerSecret,
    callbackURL:  config.configtwitter.callBackUrl
  },
  function(token, tokenSecret, profile, done) {
    var user = profile;
    return done(null, user);
  }
));

app.get('/logout',
  function(req, res) {
    req.logout();
    res.redirect('/');
  });

app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback', passport.authenticate('twitter', { successReturnToOrRedirect: '/account', failureRedirect: '/auth/twitter' }));

app.use(express.static(path.join(__dirname, 'public')));
app.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  res.locals.username = req.user ? req.user.username : null;
  res.locals.userpic = req.user ? req.user.photos[0].value : null;
  next();
});

app.use('/', routes);
app.use('/users', users);
app.use('/account', account);




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
