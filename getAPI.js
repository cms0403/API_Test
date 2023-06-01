const express = require('express');
const jwt = require('jsonwebtoken');
const SECRET_KEY = require('./secret_key.js');
//서버 생성
const app = express();

//라우터 설정
app.get('/', (request, response) => {
    response.sendFile(__dirname + '/page/index.html');
})

app.use('/user', require('./authmiddleware.js'));
app.use('/user', require('./routes/userDB.js'));

app.post('/token', async (request, response, next) => {
    token = await jwt.sign({
        type: 'JWT',
    }, SECRET_KEY, {
        expiresIn: '1m', // 만료시간 1분
    });
    return response.status(200).json({
        code: 200,
        message: '토큰이 발급되었습니다.',
        token: token
    });
});

app.get('/tokencheck', (request, response) => {
    var token = request.headers['token'];
    try {
        var payload = jwt.verify(token, SECRET_KEY);
        console.log('토큰 인증 성공', payload);
        response.json({ msg: 'success' });
    } catch (error) {
        response.status(500);
        response.send(error.message);
    }
})

//서버실행
app.listen(52273, () => {
    console.log('Server Running at http://127.0.0.1:52273');
})