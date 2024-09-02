// 기본적인 require 설정
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const bodyParser = require('body-parser');

// Router 설정
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const loginRouter = require('./routes/login');
const registerRouter = require('./routes/register');
const communityRouter = require('./routes/community');

// DB 설정
const mysql = require('mysql');
const dbconfig = require('./config/database');
const connection = mysql.createConnection(dbconfig);

const app = express();

// 뷰 엔진 설정
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// 미들웨어 설정
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 세션 저장소 설정
const sessionStore = new MySQLStore({}, connection);

// 세션 설정
app.use(session({
  key: 'userSession',
  secret: 'H3lLoW0R1D',
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 } // 1시간
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// 로그인 여부를 확인하는 미들웨어
function isAuthenticated(req, res, next) {
  if (req.session && req.session.username) {
    return next();
  } else {
    return res.redirect('/login');
  }
}

// 라우터 설정
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/community', communityRouter);
app.use('/check-session', require('./routes/checkSession'));
app.use('/logout', require('./routes/logout'));
app.use('/session-info', require('./routes/session-info'));

// 메인 페이지 라우트
app.get('/', (req, res) => {
  if (req.session.username) {
    res.redirect('/index');
  } else {
    res.redirect('/login');
  }
});

// index 페이지 라우트
app.get('/index', isAuthenticated, (req, res) => {
  res.render('index', { username: req.session.username });
});

// 로그인 페이지 라우트
app.get('/login', (req, res) => {
  if (req.session.userId) {
    return res.redirect('/index');
  }
  res.render('login');
});

// 404 에러 핸들러
app.use(function(req, res, next) {
  next(createError(404));
});

// 에러 핸들러
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', { message: err.message, error: err });
});

module.exports = app;
