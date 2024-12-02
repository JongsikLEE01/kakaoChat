const express = require('express');
const axios = require('axios');
const router = express.Router();
require('dotenv').config();

const API_KEY = process.env.VIVINO_API_KEY;

// [POST] /wines 엔드포인트 설정
router.post('/wines', async (req, res) => {
    const { wineType, priceRange } = req.body;
  
    try {
      // Vivino API 요청
      const response = await axios.get('https://api.vivino.com/wines', {
        headers: {
          Authorization: `Bearer ${API_KEY}`
        },
        params: {
          wine_type: wineType || 'red',
          price_range_min: priceRange?.min || 0,
          price_range_max: priceRange?.max || 100000,
          per_page: 1
        }
      });
  
      // API 응답 데이터 처리
      const wines = response.data.wines.map((wine) => ({
        name: wine.name,
        price: wine.price,
        description: wine.description || '설명이 없습니다.',
        region: wine.region || '지역 정보 없음',
        imageUrl: wine.image_url || '이미지 없음',
        detailUrl: wine.detail_url || 'https://vivino.com'
      }));
  
      // JSON 응답 데이터 작성
      res.status(200).json({
        message: '와인 추천 결과입니다.',
        template: {
          outputs: wines.map((wine) => ({
            basicCard: {
              title: wine.name,
              description: `지역 : ${wine.region}\n가격 : ${wine.price}원\n설명 : ${wine.description}\n`,
              thumbnail: {
                imageUrl: wine.imageUrl
              },
              buttons: [
                {
                  action: 'webLink',
                  label: '상세 보기',
                  webLinkUrl: wine.detailUrl
                }
              ]
            }
          }))
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: '와인 추천 중 오류가 발생했습니다.',
        error: error.message
      });
    }
  });

module.exports = router;