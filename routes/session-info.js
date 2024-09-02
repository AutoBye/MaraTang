const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');


// Body parser middleware
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

//db
const mysql      = require('mysql');
const dbconfig   = require('./../config/database');
const connection = mysql.createConnection(dbconfig);

// 데이터베이스 연결
connection.connect((err) => {
    if (err) throw err;
    console.log('MySQL 데이터베이스에 연결되었습니다.');
});


// 세션 정보 라우트
router.get('/', (req, res) => {
    if (req.session && req.session.username) {
        res.json({ success: true, username: req.session.username });
    } else {
        res.json({ success: false });
    }
});

module.exports = router;