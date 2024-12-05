const express = require('express');
const { translate } = require('../utils/translate');
const axios = require('axios');
const router = express.Router();
require('dotenv').config();

const KRW_TO_USD = 0.00071; // 원화에서 달러로 변환 비율
const FEE_USD = 10;         // 배송비
const CUSTOMS_RATE = 0.2;   // 관세율
const TAX_RATE = 0.3;       // 주세율

const API_KEY = process.env.SPOONACULAR_API_KEY;
const URL = 'https://api.spoonacular.com/food/wine/recommendation';

// 세자리 올림
const roundToNumber = (amount) => {
  return Math.ceil(amount / 1000) * 1000;
};

// [POST] /wines 엔드포인트
router.post('/wines', async (req, res) => {
  const { amount, wineType, minRating } = req?.body?.action?.params;
  
  if (!amount || typeof amount !== 'number')
    return res.status(400).json({ message: "유효한 금액을 입력해주세요." });

  // 원화를 달러로 변환
  const maxPriceUSD = Math.round((amount * KRW_TO_USD) * 100) / 100;

  // Spoonacular API 호출
  try {
    const response = await axios.get(URL, {
      params: {
        wine: wineType || 'merlot',
        maxPrice: maxPriceUSD || 10,
        minRating: minRating || 0.7,
        number: 1,
        apiKey: API_KEY,
      },
    });

    // API 응답 처리
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

    // JSON 응답 데이터 작성
    res.status(200).json({
      message: '추천된 오늘의 와인입니다.',
      wines,
    });
  } catch (e) {
    console.error('와인 추천 중 오류 발생:', e.message);
    res.status(500).json({
      message: '와인 추천 중 오류가 발생했습니다.',
      e: e.message,
    });
  }
});

module.exports = router;