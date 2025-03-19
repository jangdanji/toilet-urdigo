import axios from 'axios';
import { createClient } from '@supabase/supabase-js'

// Supabase 설정
const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

// 네이버 API 키 설정
const NAVER_CLIENT_ID = process.env.VITE_NAVER_MAP_ID;
const NAVER_CLIENT_SECRET = process.env.VITE_NAVER_MAP_KEY;

// 국토교통부 브이월드 API
const VWORLD_KEY = process.env.VITE_VWORLD_KEY;
const SITE_URL = process.env.VITE_URL;

const naverApi = axios.create({
    baseURL: 'https://naveropenapi.apigw.ntruss.com',
    headers: {
      'X-NCP-APIGW-API-KEY-ID': NAVER_CLIENT_ID,
      'X-NCP-APIGW-API-KEY': NAVER_CLIENT_SECRET,
      'Accept': 'application/json'
    }
});
  
/**
 * 주소를 좌표로 변환하는 네이버 지오코딩 API 함수
 */
export const getGeocode = async (address) => {
  const response = await naverApi.get('/map-geocode/v2/geocode', {
    params: {
      query: address
    }
  });
  return response.data;
};

/**
 * 좌표를 주소로 변환하는 네이버 지오코딩 API 함수
 */
export const getReverseGeocode = async (lat, lng) => {
  const params = {
    coords: `${lng},${lat}`,
    output: 'json',
    orders: 'legalcode'
  };
  const response = await naverApi.get(`/map-reversegeocode/v2/gc`, { params });
  
  // 가장 세부적인 좌표값 추출 로직
  let detailedCoords = { x: lat, y: lng }; // 기본값으로 입력받은 좌표 사용
  
  try {
    const result = response.data.results[0];
    
    // 가장 세부적인 유효한 지역 찾기
    for (let i = 4; i >= 0; i--) {
      const areaKey = `area${i}`;
      const area = result.region[areaKey];
      
      // 좌표가 유효한지 확인 (이름이 있고 좌표가 0,0이 아닌 경우)
      if (area && area.name && 
          area.coords && area.coords.center && 
          (area.coords.center.x !== 0 || area.coords.center.y !== 0)) {
        
        detailedCoords = {
          x: area.coords.center.x,
          y: area.coords.center.y,
          name: area.name
        };
        break;
      }
    }
    
    return {
      detailedCoords
    };
  } catch (error) {
    console.error('Error extracting detailed coordinates:', error);
    return {
      detailedCoords
    };
  }
};

/*
 * 업데이트/삽입할 Toilet 데이터 객체 (1개만 upsert)
 */
export const upsertToilet = async (item) => {
  const { data, error } = await supabase
  .from('toilets')
  .upsert(item, {
    // 이름, 주소, 관리기관명에서 기존 데이터 중복 감지
    onConflict: ['name', 'address', 'management']
  })
  .select();
  return { data, error };
};

export const getRegions = async () => {
  const { data, count, error } = await supabase
    .from('regions')
    .select('*', { count: 'exact' });

  // console.log('Total regions count:', count);

  const lastPage = Math.ceil(count / 1000);
  const allRegions = [];

  for (let page = 1; page <= lastPage; page++) {

    console.log(page)

    await new Promise((resolve) => setTimeout(resolve, 100));

    const { data } = await supabase
      .from('regions')
      .select('*')
      .range((page - 1) * 1000, (page - 1) * 1000 + 999)

    allRegions.push(...data);

  }

  return { data: allRegions, count, error };
};


export const getToilets = async (params) => {

  /*
    수파베이스에서는 지리 데이터 처리 확장 기능 postgis를 지원함 
    기능 활성화 : CREATE EXTENSION postgis WITH SCHEMA extensions;
    좌표 저장할 때 컬럼에 `geography(POINT)` 타입을 써야 postGIS 함수들 사용 가능

  */

  const { data, error } = await supabase.rpc('get_nearest_locations', params);

  if (error) {
    console.error('Error fetching nearest locations:', error);
    return { data: [], error };
  } else {
    console.log('Nearest toilets:', data);
    return { data, error: null };
  }
};
