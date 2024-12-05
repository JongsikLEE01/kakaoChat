# Kakao Chatbot Skill Server
### Project Blog
<a href="https://screeching-bench-b7a.notion.site/dove-512d5b5a52234172b5640a2d77e44bc3"><img src="https://img.shields.io/badge/Project-000000?style=flat&logo=notion&logoColor=white"/></a>
<br><br>

## 0. 구조
1. **프로젝트 개요**
    - 주요 기능
    - 사용 기술
2. **폴더 구조**
3. **기능 설계**
    - 음식 추천
    - 텍스트 번역
    - 맞춤형 와인 추천
    - 달러 원화 변환 및 세금 계산
4. **주요 기능**
    - 라우터 설정
    - 음식 추천
    - 와인 추천
    - 번역 및 금액 계산
    - 요청 값
    - 반환 값
5. **사용 가이드**
    - 깃 클론
    - 패키지 설치
    - 서버 실행
    - ngrok 설정
6. **카카오 챗봇 설정 및 테스트**
    - 스킬 설정
    - 챗봇 시나리오 설정
    - 카카오톡 테스트 화면

<br><br><br>

## 1. **프로젝트 개요**

### 주요 기능
- 카카오톡 사용자의 입력을 받아 음식 추천
- 카카오 스킬 서버와의 JSON 응답 처리
- axios를 이용한 HTTP 요청
- Spoonacular API를 이용한 금액대, 종류 별 와인 추천
- Papago API를 이용한 한국어 번역

<br>

### 사용 기술
- Node.js        v22.11.0
- Express.js     v4.21.1
- ngrok          v3.18.4

<br><br><br>

## 2. **폴더 구조**

```
skill-server-example
├── list                    # 데이터 리스트
│   └── foodList.json
├── routes                  # 라우팅 및 API 엔드포인트
│   └── food.js
│   └── wine.js
├── utils                   # 유틸리티 파일
│   └── translate.js
├── index.js                # 메인 서버 파일
├── package.json            # 프로젝트 설정 및 종속성
└── package-lock.json       # 종속성 버전 잠금 파일
```

<br><br><br>

## 4. 주요 기능
- 카카오톡 사용자의 입력을 받아 음식 추천
- 카카오 스킬 서버와의 JSON 응답 처리
- Spoonacular API를 이용한 금액대, 로 Express.js를 기반으로 서버를 실행하고 `/api` 라우트를 연결
    ```jsx
    const express = require('express');
    const bodyParser = require('body-parser');
    const food = require('./routes/food');
    
    const app = express();
    const port = 3000;
    
    app.use(bodyParser.json());
    app.use('/api', food);
    
    app.listen(port, () => {
      console.log(`서버가 ${port}번 포트에서 실행 중입니다....`);
    });
    ```

<br>
    

- **`food.js`**
음식 추천 API를 처리하는 라우팅 파일으로 POST 요청을 받아 카테고리별 추천 결과를 반환
    ```jsx
    const express = require('express');
    const router = express.Router();
    const foodList = require('../list/foodList.json');
    
    router.post('/foods', (req, res) => {
      // 코드...
    });
    
    module.exports = router;
    ```
    
    <br>

- 

## 5. **사용 가이드**

### **1. 깃허브 클론**
```bash
git clone https://github.com/JongsikLEE01/kakaoChat.git
cd kakaoChat
```

<br>

### **2. 패키지 설치**
```bash
npm install
```

<br>

### **3. 서버 실행**
```bash
node index.js
```

<br>

### **4. ngrok 설정**
```bash
ngrok http 3000
```
ngrok URL을 카카오 스킬 설정에 사용

<br><br><br>

## 6. 카카오 챗봇 설정 및 테스트

### 스킬 설정
![스크린샷 2024-11-29 114053](https://github.com/user-attachments/assets/3aafb2e2-fba2-4d28-ab07-89a9831bc96c)
챗봇은 기본적으로 POST 방식으로 `https://url/api/` 로 경로가 지정되고, 내가 설정한 엔드포인트인 foods로 경로에 json 데이터를 보내 요청하고 json 데이터를 반환 받도록 설정

<br>

### 챗봇 시나리오 설정
![스크린샷 2024-11-29 114106](https://github.com/user-attachments/assets/07ab544f-0a2e-4dcf-9ff4-8f4cc97cbb8c)
챗봇의 경우 응답메세지를 {{webhook}}으로 설정해야 응답한 메세지가 출력

<br>

### 카카오톡 테스트 화면
![image](https://github.com/user-attachments/assets/4d98a7c0-4a7e-4f57-8706-beda0d72eba9)

