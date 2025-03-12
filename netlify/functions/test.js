import { createClient } from '@supabase/supabase-js'
import axios from 'axios';

// 네이버 API 키 설정
const NAVER_CLIENT_ID = process.env.VITE_NAVER_MAP_ID;
const NAVER_CLIENT_SECRET = process.env.VITE_NAVER_MAP_KEY;

// Supabase 설정
const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

exports.handler = async function(event, context) {
  try {

    // API 호출
    const response = await axios.get('https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode', {
      params: {
        query: '분당구 불정로 6'
      },
      headers: {
        'X-NCP-APIGW-API-KEY-ID': NAVER_CLIENT_ID,
        'X-NCP-APIGW-API-KEY': NAVER_CLIENT_SECRET,
        'Accept': 'application/json'
      }
    });

    // // lat 값이 없는 데이터만 필터링 (필요한 경우)
    // let resultData = allData;
    // if (shouldFilterEmpty) {
    //   resultData = allData.filter(item => !item.lat || item.lat === '' || item.lat === null);
    //   console.log(`필터링된 데이터 수: ${resultData.length}`);
    // }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({
        data: response.data,
        // total: count,
        // filteredCount: resultData.length
      })
    };
  } catch (error) {
    console.error('에러 발생:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({ error: error.message })
    };
  }
}
