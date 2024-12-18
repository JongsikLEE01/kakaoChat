const express = require('express');
const bodyParser = require('body-parser');
const food = require('./routes/food');
const wine = require('./routes/wine');

const app = express();
const port = 3000;

// 바디 파서 미들웨어 설정
app.use(bodyParser.json());

// 라우터 연결
app.use('/api', food);
app.use('/api', wine);

// 서버 실행
app.listen(port, () => {
  console.log(`서버가 ${port}번 포트에서 실행 중입니다....`);
});