const express = require('express');
const axios = require('axios');
const router = express.Router();
require('dotenv').config();
const { translate } = require('../utils/translate');
const wineTypes = require('../list/wineList.json');

// 상수
const KRW_TO_USD = 0.00071; // 원화에서 달러로 변환 비율
const FEE_USD = 10;         // 배송비
const CUSTOMS_RATE = 0.2;   // 관세율
const TAX_RATE = 0.3;       // 주세율
const API_KEY = process.env.SPOONACULAR_API_KEY;
const URL = 'https://api.spoonacular.com/food/wine/recommendation';

// 세자리 올림 함수
const roundToNumber = (amount) => {
  return Math.ceil(amount / 1000) * 1000;
};

// 랜덤 와인 추천 함수
function recommendWine(wineType) {
  if (!wineTypes[wineType]) {
    console.log("유효하지 않은 와인 타입입니다.");
    return null;
  }
  const wines = wineTypes[wineType];
  return wines[Math.floor(Math.random() * wines.length)];
}

// [POST] /wines 엔드포인트
router.post('/wines', async (req, res) => {
  const { amount, wineType } = req?.body?.action?.params;
  
  // 유효성 검사
  const randomWineType = recommendWine(wineType);
  if (!randomWineType)
    return res.status(200).json({ msg: "와인 타입을 입력해주세요." });
  if (!amount)
    return res.status(200).json({ msg: "금액을 입력해주세요." });

  // 원화를 달러로 변환
  const maxPriceUSD = Math.round((amount * KRW_TO_USD) * 100) / 100;

  // Spoonacular API 호출
  try {
    const response = await axios.get(URL, {
      params: {
        wine: randomWineType,         // 와인 종류
        maxPrice: maxPriceUSD || 10,  // 최대 금액
        minRating: 0.9,               // 평점(0.9 고정)
        number: 1,                    // 추천 수량(1개 고정)
        apiKey: API_KEY,
      },
    });

    // wineType 중 1개 랜덤으로 추천
    const wine = response.data.recommendedWines[0];

    // 금액 계산
    const priceUSD = parseFloat(wine.price.replace('$', ''));
    const totalUSD = priceUSD + FEE_USD;                  // 와인 + 배송비
    const dutyUSD = totalUSD * CUSTOMS_RATE;              // 관세
    const taxUSD = (totalUSD + dutyUSD) * TAX_RATE;       // 주세
    const finalPrice = totalUSD + dutyUSD + taxUSD;       // 최종 달러
    const price = roundToNumber(finalPrice / KRW_TO_USD); // 최종 원화

    // 번역
    const korName = await translate(wine.title || '와인 없음');
    const korDescription = await translate(wine.description || '설명 없음');

    // 응답 데이터
    res.status(200).json({
      version: "2.0",
      data: {
        msg: `추천하는 ${wineType}입니다.`,
        name: korName,
        description: korDescription,
        price: `${price}원`,
      },
    });

  } catch (e) {
    console.error('와인 추천 중 오류 발생...', e.msg);
    res.status(400).json({
      msg: '와인 추천 중 오류가 발생...',
      e: e.msg,
    });
  }
});

module.exports = router;