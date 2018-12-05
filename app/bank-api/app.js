var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require("mysql");
var redis = require('redis');
var bodyParser = require('body-parser');
var loginRouter = require('./routes/login');
var logoutRouter = require('./routes/logout');
var customersRouter = require('./routes/customers');
var accountsRouter = require('./routes/accounts');
var transactionsRouter = require('./routes/transactions');
var contactsRouter = require('./routes/contacts');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function (req, res, next) {
	res.locals.connection = mysql.createConnection({
		host: process.env.BANKAPI_DB_HOSTNAME,
		user: 'bankappuser',
		password: 'AppUserPassword',
		database: 'bankdb',
		multipleStatements: true
	});
	res.locals.connection.connect();
	next();
});

app.use(function (req, res, next) {
	res.locals.redisClient = redis.createClient(process.env.BANKAPI_REDIS_PORT, process.env.BANKAPI_REDIS_HOSTNAME, { password: "redispassword" });
	res.locals.redisClient.on('error', function (err) {
		throw('Something went wrong ' + err);
	});

	next();
});

app.use('/api/v1/login', loginRouter);
app.use('/api/v1/logout', logoutRouter);
app.use('/api/v1/customers', customersRouter);
app.use('/api/v1/accounts', accountsRouter);
app.use('/api/v1/transactions', transactionsRouter);
app.use('/api/v1/contacts', contactsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
