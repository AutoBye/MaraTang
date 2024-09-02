const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const dbconfig = require('../config/database');
const connection = mysql.createConnection(dbconfig);

// 세션확인
function isAuthenticated(req, res, next) {
    if (req.session && req.session.userId) {
        return next();
    } else {
        return res.redirect('/login'); // 세션이 없으면 로그인 페이지로 리디렉션
    }
}


// 커뮤니티 생성 폼 렌더링 (이 부분을 상단으로 이동)
router.get('/new', (req, res) => {
    res.render('community_new');
});

// 커뮤니티 목록 조회 및 렌더링
router.get('/', isAuthenticated, (req, res) => {
    const query = `
        SELECT 
            communities.community_id, 
            communities.name, 
            users.username AS created_by, 
            communities.created_at 
        FROM communities 
        JOIN users ON communities.created_by = users.user_id`;

    connection.query(query, (err, results) => {
        if (err) return res.status(500).send('서버 오류가 발생했습니다.');
        res.render('community_list', { communities: results });
    });
});

// 특정 커뮤니티 조회 및 렌더링
router.get('/:id', (req, res) => {
    const communityId = req.params.id;

    const communityQuery = `
        SELECT communities.*, users.username AS created_by
        FROM communities
                 JOIN users ON communities.created_by = users.user_id
        WHERE community_id = ?`;

    const postsQuery = `
        SELECT posts.*, users.username AS author
        FROM posts
                 JOIN users ON posts.author_id = users.user_id
        WHERE community_id = ?
        ORDER BY posts.created_at DESC`;

    connection.query(communityQuery, [communityId], (err, communityResults) => {
        if (err) return res.status(500).send('서버 오류가 발생했습니다.');
        if (communityResults.length === 0) return res.status(404).send('커뮤니티를 찾을 수 없습니다.');

        connection.query(postsQuery, [communityId], (err, postsResults) => {
            if (err) return res.status(500).send('서버 오류가 발생했습니다.');
            res.render('community_detail', { community: communityResults[0], posts: postsResults });
        });
    });
});

// 커뮤니티 생성 처리
router.post('/', (req, res) => {
    const { name, description } = req.body;
    const created_by = req.session.userId; // 세션에서 사용자 ID 가져오기

    if (!created_by) {
        return res.status(401).send('로그인이 필요합니다.');
    }

    const query = `
        INSERT INTO communities (name, description, created_by, created_at, updated_at) 
        VALUES (?, ?, ?, NOW(), NOW())`;
    connection.query(query, [name, description, created_by], (err, results) => {
        if (err) {
            console.error('커뮤니티 생성 오류:', err);
            return res.status(500).send('서버 오류가 발생했습니다.');
        }
        res.redirect('/community'); // 커뮤니티 목록 페이지로 리디렉션
    });
});

router.get('/new', (req, res) => {
    if (!req.session.username) {
        return res.redirect('/login');  // 로그인되지 않은 사용자는 로그인 페이지로 리디렉션
    }
    res.render('community_new', { username: req.session.username });
});

// 커뮤니티 수정 폼 렌더링
router.get('/:id/edit', (req, res) => {
    const communityId = req.params.id;
    const query = 'SELECT * FROM communities WHERE community_id = ?';
    connection.query(query, [communityId], (err, results) => {
        if (err) return res.status(500).send('서버 오류가 발생했습니다.');
        if (results.length === 0) return res.status(404).send('커뮤니티를 찾을 수 없습니다.');
        res.render('community_edit', { community: results[0] });
    });
});

// 커뮤니티 수정 처리
router.post('/:id', (req, res) => {
    const communityId = req.params.id;
    const { name, description } = req.body;
    const query = 'UPDATE communities SET name = ?, description = ? WHERE community_id = ?';
    connection.query(query, [name, description, communityId], (err, results) => {
        if (err) return res.status(500).send('서버 오류가 발생했습니다.');
        res.redirect(`/community/${communityId}`);
    });
});

// 커뮤니티 삭제 처리
router.post('/:id/delete', (req, res) => {
    const communityId = req.params.id;
    const query = 'DELETE FROM communities WHERE community_id = ?';
    connection.query(query, [communityId], (err, results) => {
        if (err) return res.status(500).send('서버 오류가 발생했습니다.');
        res.redirect('/community');
    });
});

// 포스트 작성 폼 표시
router.get('/:id/post/new', isAuthenticated, (req, res) => {
    const communityId = req.params.id;

    const query = 'SELECT * FROM communities WHERE community_id = ?';
    connection.query(query, [communityId], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('서버 오류가 발생했습니다.');
        }

        if (results.length === 0) {
            return res.status(404).send('커뮤니티를 찾을 수 없습니다.');
        }

        const community = results[0];
        res.render('post_new', { community }); // posts를 전달하지 않음
    });
});

// 포스트 작성 처리
router.post('/:id/post', isAuthenticated, (req, res) => {
    const communityId = req.params.id;
    const { title, content, image_url } = req.body;
    const authorId = req.session.userId; // 현재 로그인한 사용자 ID

    const query = `
        INSERT INTO posts (community_id, author_id, title, content, image_url, created_at, updated_at) 
        VALUES (?, ?, ?, ?, ?, CURDATE(), CURDATE())`;

    connection.query(query, [communityId, authorId, title, content, image_url], (err, results) => {
        if (err) return res.status(500).send('서버 오류가 발생했습니다.');
        res.redirect(`/community/${communityId}`);
    });
});

module.exports = router;
