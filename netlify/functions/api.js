import axios from 'axios';
import { createClient } from '@supabase/supabase-js'

// Supabase 설정
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// 네이버 API 키 설정
const NAVER_CLIENT_ID = process.env.NAVER_MAP_ID || process.env.VITE_NAVER_MAP_ID;
const NAVER_CLIENT_SECRET = process.env.NAVER_MAP_KEY || process.env.VITE_NAVER_MAP_KEY;

// 국토교통부 브이월드 API
const VWORLD_KEY = process.env.VWORLD_KEY || process.env.VITE_VWORLD_KEY;

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
    orders: 'addr'
  };
  const response = await naverApi.get(`/map-reversegeocode/v2/gc`, { params });
  
  try {
    const result = response.data.results[0];

    console.log("result : ", result)

    // 주소 문자열 생성 (area0은 국가코드이므로 제외)
    let address = '';
    const region = result.region;
    
    // area1부터 area4까지 순서대로 주소 생성 (비어있지 않은 경우만)
    for (let i = 1; i <= 4; i++) {
      const areaKey = `area${i}`;
      if (region[areaKey] && region[areaKey].name) {
        address += (address ? ' ' : '') + region[areaKey].name;
      }
    }
    
    return { address };
  } catch (error) {
    console.error('Error extracting detailed coordinates:', error);
    return { address: null };
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
    좌표 저장할 때 컬럼에 ` ` 타입을 써야 postGIS 함수들 사용 가능

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

export const getMap = async () => {

  const params = {
    crs: 'EPSG:4326',
    center: '127.1054221,37.3591614',
    level: 10,
    w: 1024,
    h: 1024,
    maptype: 'basic',
    format: 'jpeg',
    scale: 2,
    // markers: 'pos:126.9810479%2037.5695075',
    lang: 'ko'
  }

  try {
    const response = await naverApi.get('/map-static/v2/raster', { params, responseType: 'arraybuffer' });
    // 이미지 데이터를 Base64로 인코딩하여 반환
    return Buffer.from(response.data, 'binary').toString('base64');

  } catch (error) {
    console.error('Error fetching map:', error);
    return { data: null, error };
  }
};

export const getToiletDetails = async (id) => {
  const { data, error } = await supabase.rpc('get_toilet_details', { toilet_id: id });

  if (error) {
    console.error('Error fetching toilet details:', error);
    return { data: null, error };
  } else {
    return { data: data[0], error: null };
  }
};