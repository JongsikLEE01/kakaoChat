# Kakao Chatbot Skill Server
### Project Blog
<a href="https://screeching-bench-b7a.notion.site/Toy-1103764bd78b80588802ec1a897443fe"><img src="https://img.shields.io/badge/Project-000000?style=flat&logo=notion&logoColor=white"/></a>
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
│   └── wineList.json
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


# 3. 설계
### 음식 추천
- 한식, 일식, 양식, 중식 중 사용자가 입력한 값에 따라 데이터를 랜덤으로 한개를 추출해 음식을 추천

### 텍스트 번역
- 추천된 와인의 이름과 설명을 번역 (영어 → 한국어)

### 맞춤형 와인 추천
- 예산 10만원, 와인 종류 `merlot` → 추천 와인 목록 제공

### 달러를 원화로 변환
- 상수로 지정된 비율에 따라 원화로 변환
- 주세, 배송비 등 각종 세금을 부과해 한국에 맞춘 금액 변경

<br><br><br>

## 4. 주요 기능
- 카카오톡 사용자의 입력을 받아 음식 추천
- 카카오 스킬 서버와의 JSON 응답 처리
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

        // [POST] /foods 엔드포인트 설정
        router.post('/foods', (req, res) => {
          try {
            // input에서 음식 카테고리 추출
            const category = req.body?.userRequest?.utterance;

            // 기본 응답 데이터 설정
            let food = [];
            let msg = "유효한 음식 카테고리를 입력해주세요.(한식, 중식, 양식, 일식)";

            // 사용자가 입력한 카테고리명이 유효한 경우
            if (category) {
              if (foodList[category]) {
                food = foodList[category];
                msg = `${category}에 대한 음식 추천입니다.`;
              } else {
                msg = "등록된 음식 카테고리가 아닙니다. 한식, 중식, 양식, 일식 중에서 선택해주세요.";
              }
            }

            // 음식 목록이 존재하면 랜덤으로 하나 선택
            const randomFood = food.length > 0 ? food[Math.floor(Math.random() * food.length)] : null;

            // 카카오톡 응답 - JSON 반환
            return res.status(200).send({
              version: "2.0",
              data: {
                category: category || "알 수 없음",
                food: randomFood || "추천할 음식이 없습니다.",
                msg
              }
            });

          } catch (e) {
            console.error("서버 응답 중 에러 발생...\n 에러코드 : ", e);
            return res.status(500).send({
              version: "2.0",
              data: {
                e: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
              }
            });
          }
        });

        module.exports = router;
    ```
    
    <br>

- **`wine.js`**
요청 값에 따라 와인을 추천하는 API를 호출
    ```jsx
       const response = await axios.get(URL, {
         params: {
        	 wine: wineType || 'merlot',
        	 maxPrice: maxPriceUSD || 10,
           minRating: minRating || 0.7,
           number: 1,
           apiKey: API_KEY,
           },
        });
    ```
    
    <br>

- **`wine.js`**
번역 및 원화를 한화로 변경하며 각종 세금을 추가하고 값을 반환
    ```jsx
        const wines = await Promise.all(
        	response.data.recommendedWines.map(async (wine) => {
        	  const priceUSD = parseFloat(wine.price.replace('$', ''));
            const totalUSD = priceUSD + FEE_USD;                  // 와인 + 배송비
            const dutyUSD = totalUSD * CUSTOMS_RATE;              // 관세
            const taxUSD = (totalUSD + dutyUSD) * TAX_RATE;       // 주세
            const finalPrice = totalUSD + dutyUSD + taxUSD;       // 최종 달러
            const price = roundToNumber(finalPrice / KRW_TO_USD); // 최종 원화

            // 번역
            const korName = await translate(wine.title || '와인 없음');
            const korDescription = await translate(wine.description || '설명 없음');

            return {
        	    name: korName,
        	    description: korDescription,
        	    price: `${price}원 입니다.`,
        	    imageUrl: wine.imageUrl || '이미지 없음',
            };
          })
        );
    ```
    
    <br>

- **`translate.js`**
번역 API를 사용해 와인 이름과 와인의 설명을 반환
    ```jsx
        const PAPAGO_API_URL = 'https://naveropenapi.apigw.ntruss.com/nmt/v1/translation';

        async function translate(text, sourceLang, targetLang) {
          try {
            const response = await axios.post(PAPAGO_API_URL, null, {
              headers: {
                'Content-Type': 'application/json',
                'X-NCP-APIGW-API-KEY-ID': API_ID,
                'X-NCP-APIGW-API-KEY': API_KEY,
              },
              params: {
                source: sourceLang,
                target: targetLang,
                text: text,
              },
            });
            return response.data.message.result.translatedText;
          } catch (error) {
            console.error('번역 오류... ', error.response?.data || error.message);
            throw new Error('번역 실패...');
          }
        }
    ```
    
    <br>

- **`요청 값`**
    ```json
        {
          "action": {
            "params": {
              "amount": 100000,
              "wineType": "merlot",
              "minRating": 0.8
            }
          }
        }
    ```
    
    <br>

- **`반환 값`**
번역 API를 사용해 와인 이름과 와인의 설명을 반환
    ```json
        {
          "response": {
            "message": "추천된 오늘의 와인입니다.",
            "wines": [
              {
                "name": "롤링 스톤스 50주년 기념 40 릭스 메를로 와인",
                "description": "2012년형 메를로는 멘도시노 카운티 스타일의 태도를 잘 보여줍니다. 블랙 체리, 가죽, 담배의 향 뒤에는 바닐라 위에 풍부한 향의 시나몬 향이 이어집니다. 이 드라이 레드 와인은 허브 로스팅 치킨, 구운 소고기 또는 스모키 칠리와 잘 어울립니다.",
                "price": "60000원 입니다.",
                "imageUrl": "https://img.spoonacular.com/products/428396-312x231.jpg"
              }
            ]
          }
        }
    ```
    
    <br><br>

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

### 음식 추천 스킬 설정
![스크린샷 2024-11-29 114053](https://github.com/user-attachments/assets/3aafb2e2-fba2-4d28-ab07-89a9831bc96c)
챗봇은 기본적으로 POST 방식으로 `https://url/api/` 로 경로가 지정되고, 내가 설정한 엔드포인트인 foods로 경로에 json 데이터를 보내 요청하고 json 데이터를 반환 받도록 설정

### 와인 추천 스킬 설정
![와인스킬테스트](https://github.com/user-attachments/assets/bb03bd0b-a061-49dd-965f-ef98cbb48bd1)

<br>

### 음식 추천 챗봇 시나리오 설정
![스크린샷 2024-11-29 114106](https://github.com/user-attachments/assets/07ab544f-0a2e-4dcf-9ff4-8f4cc97cbb8c)

챗봇의 경우 응답메세지를 {{webhook}}으로 설정해야 응답한 메세지가 출력
### 와인 추천 챗봇 시나리오 설정
![와인시나리오](https://github.com/user-attachments/assets/20a3f806-18db-4b58-9f01-89d4666f3483)
![와인되묻기](https://github.com/user-attachments/assets/a19df67c-cf1e-4f5a-bcd8-360fe74160cf)

필수 파라미터의 경우 되묻기 질문을 설정해야 정상적으로 작동

<br>


### 음식 추천 카카오톡 테스트 화면
![image](https://github.com/user-attachments/assets/4d98a7c0-4a7e-4f57-8706-beda0d72eba9)
### 와인 추천 카카오톡 테스트 화면
![와인카카오톡](https://github.com/user-attachments/assets/24b43a3b-6342-400b-861b-736402e34a94)


