const axios = require('axios');
require('dotenv').config();

// API 설정
const PAPAGO_API_URL = 'https://naveropenapi.apigw.ntruss.com/nmt/v1/translation';
const API_ID = process.env.PAPAGO_API_KEY;
const API_KEY = process.env.PAPAGO_API_KEY_ID;

/**
 * 번역 함수
 * @param {*} text 번역 문장
 * @returns 
 */
async function translate(text, sourceLang, targetLang) {
  try {
    const response = await axios.post(PAPAGO_API_URL, {
      headers: {
        'Content-Type': 'application/json',
        'X-NCP-APIGW-API-KEY-ID': API_ID,
        'X-NCP-APIGW-API-KEY': API_KEY,
      },
      params: {
        source: 'en',
        target: 'ko',
        text: text,
      },
    });

    return response.data.message.result.translatedText;
  } catch (error) {
    console.error('번역 오류... ', error.response?.data || error.message);
    throw new Error('번역 실패...');
  }
}

module.exports = { translate };