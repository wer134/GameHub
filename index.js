const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const bcrypt = require('bcrypt');
// Middleware 설정
app.use(bodyParser.json());
app.use(cors());

// MySQL 연결 설정
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'qltkdgkfk2@@',
    database: 'user_management',
});
// 회원가입 시 비밀번호 해싱
app.post('/register', async (req, res) => {
    const { name, username, password, email, phone } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); // 10은 해싱 강도
    const sql = 'INSERT INTO users (name, username, password, email, phone) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [name, username, hashedPassword, email, phone], (err, result) => {
        if (err) {
            console.error('쿼리 오류:', err);
            return res.status(500).send('회원가입 실패');
        }
        res.status(200).send('회원가입 성공');
    });
});
// MySQL 연결
db.connect((err) => {
    if (err) {
        console.error('MySQL 연결 실패:', err);
        return;
    }
    console.log('MySQL 연결 성공!');
});

// 사용자 이름 중복 확인 API
app.get('/check-username', (req, res) => {
    const { username } = req.query;
    const sql = 'SELECT * FROM sys.users WHERE username = ?';
    db.query(sql, [username], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('서버 오류');
        }
        if (results.length > 0) {
            return res.status(400).send('이미 사용 중인 사용자 이름입니다.');
        }
        res.status(200).send('사용 가능한 사용자 이름입니다.');
    });
});

// 회원가입 API
app.post('/register', (req, res) => {
    const { name, username, password, email, phone } = req.body;
    const sql = 'INSERT INTO users (name, username, password, email, phone) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [name, username, password, email, phone], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('회원가입 실패');
        }
        res.status(200).send('회원가입 성공');
        console.log('회원가입 성공');
    });
});

// 서버 실행
app.listen(3001, () => {
    console.log('서버가 http://localhost:3001 에서 실행 중입니다.');
});