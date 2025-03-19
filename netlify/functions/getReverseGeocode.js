import { getReverseGeocode } from './api';

export const handler = async (event, context) => {
  try {
    // 요청 파라미터 로깅
    console.log('event.queryStringParameters', event.queryStringParameters);
    
    // 좌표 파라미터 가져오기
    const lat = event.queryStringParameters.lat;
    const lng = event.queryStringParameters.lng;
    
    if (!lat || !lng) { // 좌표를 입력해 주세요.
      return {
        statusCode: 400,
        body: JSON.stringify({ error: '좌표를 입력해 주세요.' })
      };
    }
    
    // API 함수 호출
    const result = await getReverseGeocode(lat, lng);
    
    // 응답 반환
    return {
      statusCode: 200,
      body: JSON.stringify(result)
    };
    
  } catch (error) {
    console.error('Error in geocode function:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ error: '지오코딩 처리 중 오류가 발생했습니다.' })
    };
  }
};
