const express = require('express');
const bodyParser = require('body-parser');
const addr = require('./routes/addr');
const food = require('./routes/food');

const app = express();
const port = 3000;

// 바디 파서 미들웨어 설정
app.use(bodyParser.json());

// 라우터 연결
app.use('/api', addr);
app.use('/api', food);

// 서버 실행
app.listen(port, () => {
  console.log(`서버가 ${port}번 포트에서 실행 중입니다....`);
});
