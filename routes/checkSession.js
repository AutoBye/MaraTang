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

router.get('/', (req, res) => {
    if (req.session.userId) {
        res.json({ loggedIn: true, username: req.session.username });
    } else {
        res.json({ loggedIn: false });
    }
});

module.exports = router;