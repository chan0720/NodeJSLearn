var express =require('express');
var path =  require('path');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var flash = require('connect-flash');
var ColorHash = require('color-hash');
require('dotenv').config();

var webSocket =  require('./socket');
var indexRouter = require('./routes');
var connect = require('./schemas');

var app = express();
connect();

var sessionMiddleware = session({
    resave: false,
    saveUninitiallized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly:true,
        secure: false,
    },
});

app.set('views', path.join(__dirname,'views'));
app.set('view engine','pug');
app.set('port', process.env.PORT || 8005);

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname,'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false}));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure:false,
    },
}));
app.use(sessionMiddleware);
app.use(flash());

app.use((req, res, next) => {
    if(!req.session.color) {
        var colorHash =  new ColorHash();
        req.session.color = colorHash.hex(req.sessionID);
    }
    next();
});


app.use('/',indexRouter);

app.use((req,res, next) => {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err: {};
    res.status(err.status ||500);
    res.render('error');
});

var server = app.listen(app.get('port'),() => {
    console.log(app.get('port'),'번 포트에서 대기 중');
});

webSocket(server, app, sessionMiddleware);