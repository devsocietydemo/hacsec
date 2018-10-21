var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require("mysql");
var redis = require('redis');
var bodyParser = require('body-parser');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');
var customersRouter = require('./routes/customers');
var accountsRouter = require('./routes/accounts');
var transactionsRouter = require('./routes/transactions');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function (req, res, next) {
	res.locals.connection = mysql.createConnection({
		host: 'db',
		user: 'bankappuser',
		password: 'AppUserPassword',
		database: 'bankdb'
	});
	res.locals.connection.connect();
	next();
});

app.use(function (req, res, next) {
	res.locals.redisClient = redis.createClient(6379, 'redis');
	res.locals.redisClient.on('error', function (err) {
		console.log('Something went wrong ' + err);
	});
	
	next();
});


app.use('/', indexRouter);
//app.use('/users', usersRouter);
app.use('/api/v1/login', loginRouter);
app.use('/api/v1/customers', customersRouter);
app.use('/api/v1/accounts', accountsRouter);
app.use('/api/v1/transactions', transactionsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
