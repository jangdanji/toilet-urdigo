// 필요한 모듈만 가져오기
import axios from 'axios'

// 환경 변수
const VWORLD_KEY = process.env.VITE_VWORLD_KEY;
const SITE_URL = process.env.VITE_URL;

export const handler = async (event, context) => {
  try {
    // 요청 파라미터 로깅
    console.log('event.queryStringParameters', event.queryStringParameters);
    
    // 파라미터에서 페이지 번호 가져오기 (기본값 1)
    const page = event.queryStringParameters?.page || '1';
    
    // VWorld API 호출
    const url = 'https://api.vworld.kr/req/data';

    const params = {
      key: VWORLD_KEY,
      domain: SITE_URL,
      service: "data",
      version: "2.0",
      request: "getfeature",
      format: "json",
      size: "1000",
      page: page,
      geometry: "false",
      attribute: "true",
      crs: "EPSG:4326",
      geomfilter: // 대한민국 전체
        "BOX(122.77143441739624, 32.689674111652815, 133.16466627619113, 42.0516845871052)",
      data: "LT_C_ADEMD_INFO", // 시군구 : LT_C_ADSIGG_INFO, 읍면동 : LT_C_ADEMD_INFO
    };

    // API 호출
    const response = await axios.get(url, { params });
    
    // 페이지 정보 추가
    const result = response.data;
    const totalPages = Math.ceil(parseInt(result.response.record.total) / 1000);

    console.log(`총 레코드 수: ${result.response.record.total}, 총 페이지 수: ${totalPages}`);

    const regions = []; // 전국의 모든 시군구면
    
    for (let i = 1; i <= totalPages; i++) {
      const response = await axios.get(url, { params: { ...params, page: i } });
      const regionData = response.data.response.result.featureCollection.features.map(f => f.properties.full_nm)
      regions.push(...regionData);
    }

    // 응답 반환
    return {
      statusCode: 200,
      body: JSON.stringify(regions)
    };
    
  } catch (error) {
    console.error('Error:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: '데이터 조회 중 오류가 발생했습니다.',
        message: error.message
      })
    };
  }
};
