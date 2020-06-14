var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var flash= require('connect-flash');
require('dotenv').config();

var {sequelize} = require('./models');
var passportConfig = require('./passport');
var authRouter = require('./routes/auth');
var indexRouter = require('./routes');
var v1 = require('./routes/v1');


var app = express();
sequelize.sync();
passportConfig(passport);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('port',process.env.PORT||8002);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  resave: false,
  saveUninitiallized:false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure:false,
  },
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use('/v1',v1);
app.use('/auth', authRouter);
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res)=> {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(app.get('port'), () =>{
  console.log(app.get('port'),'번 포트에서 대기 중');
});


