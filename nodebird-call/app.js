var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var logger = require('morgan');
require('dotenv').config();

var indexRouter = require('./routes');
const { truncateSync } = require('fs');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('port', process.env.PORT || 8003);

app.use(logger('dev'));
app.use(cookieParser(process.env.COOKIE_SERET));
app.use(session({
  resave:false,
  saveUninitialized:false,
  secret: process.env.COOKIE_SERET,
  cookie:{
    httpOnly: truncateSync,
    secure: false,
  },
}));


app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res) =>{
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
app.listen(app.get('port'),() => {
  console.log(app.get('port'),'번 포트에서 대기 중');
});

