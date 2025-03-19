import { getGeocode } from './api';

export const handler = async (event, context) => {
  try {
    // 요청 파라미터 로깅
    console.log('event.queryStringParameters', event.queryStringParameters);
    
    // 주소 파라미터 가져오기
    const address = event.queryStringParameters.address;
    
    if (!address) { // 주소를 입력해 주세요.
      return {
        statusCode: 400,
        body: JSON.stringify({ error: '주소를 입력해 주세요.' })
      };
    }
    
    // API 함수 호출
    const result = await getGeocode(address);
    
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
