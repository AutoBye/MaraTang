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


/* GET Register page. */
router.get('/', function(req, res, next) {
    res.render('register', { title: 'Express' });
});


/* GET POST Register page. */
router.post('/', (req, res) => {
    const { username, id, password, email, location } = req.body;

    // 아이디 중복 확인
    connection.query('SELECT id FROM users WHERE id = ?', [id], (error, results) => {
        if (error) {
            console.error('데이터베이스 쿼리 중 오류 발생:', error);
            return res.status(500).json({ success: false, message: '회원가입 중 오류가 발생했습니다.' });
        }

        if (results.length > 0) {
            // 이미 존재하는 아이디 처리
            return res.status(400).json({ success: false, message: '이미 존재하는 아이디입니다.' });
        }

        // 비밀번호 암호화
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                console.error('비밀번호 해싱 중 오류 발생:', err);
                return res.status(500).json({ success: false, message: '회원가입 중 오류가 발생했습니다.' });
            }

            // 새로운 사용자 데이터 삽입
            connection.query(
                `INSERT INTO users (username, id, password, email, location, created_at, updated_at, banned) 
                VALUES (?, ?, ?, ?, ?, NOW(), NOW(), 0)`,
                [username, id, hashedPassword, email, location],
                (insertError, insertResults) => {
                    if (insertError) {
                        console.error('사용자 등록 중 오류 발생:', insertError);
                        return res.status(500).json({ success: false, message: '회원가입 중 오류가 발생했습니다.' });
                    }

                    // 회원가입 성공 시 응답
                    res.json({ success: true });
                }
            );
        });
    });
});

module.exports = router;
