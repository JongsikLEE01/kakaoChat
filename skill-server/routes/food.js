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