
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var config = require('./config');
var Models = require('./models');
var auth = require('./middlewares/auth');
var setLang = require('./middlewares/setLang');
var setNav = require('./middlewares/setNav');
var multer = require('multer');
var format_datetime = require('./lib').format_datetime;
var format_orderstate = require('./lib').format_orderstate;
var format_month = require('./lib').format_month;

var app = express();

// all environments
app.set('port', process.env.PORT || config.port);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon(__dirname + '/public/favicon.ico'));
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(multer({ dest: './public/upload/'}));
app.use(express.methodOverride());
app.use(express.cookieParser(config.cookie_secret));
app.use(express.session());
app.use(express.static(path.join(__dirname, 'public')));
app.use(auth.auth_user);
app.use(setLang.setLang);
app.use(setNav.setNav);
app.use(setNav.setBasicinfo);
app.use(app.router);
app.locals.format_datetime = format_datetime;
app.locals.format_orderstate = format_orderstate;
app.locals.format_month = format_month;

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

routes(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
