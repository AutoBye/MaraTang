const express = require('express');
const router = express.Router();
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
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



/* GET Login page. */
router.get('/', function(req, res, next) {
    res.render('login', { title: 'Express' });
});

router.post('/', (req, res) => {
    const { id, password } = req.body;

    const query = 'SELECT * FROM users WHERE id = ?';
    connection.query(query, [id], (err, results) => {
        if (err) {
            console.error('DB 쿼리 오류:', err);
            return res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
        }

        if (results.length === 0) {
            return res.status(400).json({ success: false, message: 'ID가 존재하지 않습니다.' });
        }

        const user = results[0];

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                console.error('비밀번호 검증 중 오류 발생:', err);
                return res.status(500).json({ success: false, message: '비밀번호가 다릅니다.' });
            }

            if (isMatch) {
                req.session.userId = user.user_id;
                req.session.username = user.username;

                console.log('세션 저장:', req.session);

                const updateQuery = 'UPDATE users SET updated_at = NOW() WHERE id = ?';
                connection.query(updateQuery, [id], (updateErr) => {
                    if (updateErr) {
                        console.error('updated_at 갱신 오류:', updateErr);
                        return res.status(500).json({ success: false, message: '갱신 오류가 발생했습니다.' });
                    }

                    return res.json({ success: true, redirectUrl: '/index' });
                });
            } else {
                return res.status(400).json({ success: false, message: 'ID 또는 비밀번호가 잘못되었습니다.' });
            }
        });
    });
});

module.exports = router;
