const express = require('express');
const axios = require('axios');
const router = express.Router();
require('dotenv').config();

// API 설정
const API_KEY = process.env.SPOONACULAR_API_KEY;
const URL = 'https://api.spoonacular.com/food/wine/recommendation';

// [POST] /wines 엔드포인트
router.post('/wines', async (req, res) => {
  const { amount, wineType, minRating, number } = req.body;

  if (!amount || typeof amount !== 'number') {
    return res.status(400).json({ message: "유효한 금액을 입력해주세요." });
  }

  try {
    // Spoonacular API 호출
    const response = await axios.get(URL, {
      params: {
        wine: wineType || 'merlot',
        maxPrice: amount || 0,
        minRating: minRating || 0.7,
        number: number || 3,
        apiKey: API_KEY
      }
    });

    // API 응답 데이터 처리
    const wines = response.data.recommendedWines.map(wine => {
      return {
        name: wine.title || '와인 없음',
        description: wine.description || '설명 없음',
        price: amount || 0,
        imageUrl: wine.imageUrl || '이미지 없음',
        link: wine.link || 'https://spoonacular.com'
      };
    });

    // JSON 응답 데이터 작성
    res.status(200).json({
      message: '추천된 와인 목록입니다.',
      wines
    });
  } catch (error) {
    console.error('와인 추천 오류:', error.message);
    res.status(500).json({
      message: '와인 추천 중 오류가 발생했습니다.',
      error: error.message
    });
  }
});

module.exports = router;