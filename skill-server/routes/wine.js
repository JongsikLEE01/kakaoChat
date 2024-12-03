const express = require('express');
const axios = require('axios');
const router = express.Router();
require('dotenv').config();

const API_KEY = process.env.WINE_SEARCHER_API_KEY;

// [POST] /wines 엔드포인트 설정
router.post('/wines', async (req, res) => {
  /*
  const { query, priceRange } = req.body;

  try {
    // Wine-Searcher API 요청
    const response = await axios.get('https://api.wine-searcher.com/suggestions', {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      params: {
        q: query || 'red wine', // 기본 검색어
        price_min: priceRange?.min || 0,
        price_max: priceRange?.max || 100000,
      },
    });

    // 응답 데이터 처리
    const wines = response.data?.results || [];
    if (wines.length === 0) {
      return res.status(404).json({
        message: '추천할 와인이 없습니다. 조건을 변경해 다시 시도해주세요.',
      });
    }

    // JSON 응답 데이터 작성
    const results = wines.map((wine) => ({
      name: wine.name,
      price: wine.price || '가격 정보 없음',
      description: wine.description || '설명이 없습니다.',
      region: wine.region || '지역 정보 없음',
      imageUrl: wine.image_url || '이미지 없음',
      detailUrl: wine.link || 'https://www.wine-searcher.com',
    }));

    // 카카오톡 응답 - JSON 반환
    res.status(200).json({
      message: '와인 추천 결과입니다.',
      template: {
        outputs: results.map((wine) => ({
          basicCard: {
            title: wine.name,
            description: `지역 : ${wine.region}\n가격 : ${wine.price}\n설명 : ${wine.description}\n`,
            thumbnail: {
                imageUrl: wine.imageUrl,
            },
            buttons: [
              {
                action: 'webLink',
                label: '상세 보기',
                webLinkUrl: wine.detailUrl,
              },
            ],
          },
        })),
      },
    });
  } catch (error) {
    console.error('Wine-Searcher API 호출 실패:', error.message);
    res.status(500).json({
      message: '와인 추천 중 오류가 발생했습니다.',
      error: error.message,
    });
  }
    */
});

module.exports = router;