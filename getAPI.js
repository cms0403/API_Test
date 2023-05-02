var express = require('express');
const jwt = require('jsonwebtoken');
// const pool = require('./sql');
const SECRET_KEY = 'Hello';
const methodOverride = require('method-override');

//서버 생성
var app = express();
app.use(methodOverride('method'));

//라우터 설정
app.get('/', function(request, response) {
    response.sendFile(__dirname + '/page/index.html');
})

app.use('/user', require('./authmiddleware.js'));
app.use('/user', require('./routes/userDB.js'));

app.post('/token', async function(request, response, next) {
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

app.get('/tokencheck', function(request, response) {
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
app.listen(52273, function () {
    console.log('Server Running at http://127.0.0.1:52273');
})