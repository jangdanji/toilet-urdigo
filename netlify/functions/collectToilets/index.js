import { createClient } from '@supabase/supabase-js'
import pkg from 'xlsx';
const { readFile, utils } = pkg;
import { join } from 'path';
import { existsSync } from 'fs';
import axios from 'axios';

// Supabase 설정
const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

// 네이버 API 키 설정
const NAVER_CLIENT_ID = process.env.VITE_NAVER_MAP_ID;
const NAVER_CLIENT_SECRET = process.env.VITE_NAVER_MAP_KEY;

/**
 * 엑셀 파일을 읽어서 JSON 데이터로 변환하는 함수
 * only 로컬에서 데이터 올리는 작업
 */
async function readExcelFile(region) {
  try {
    // Netlify 서버리스 함수에서 동작하진 않을 것 같음, 1차적으로 대량으로 데이터 넣는 건 로컬에서 진행하기
    const fullPath = join(process.cwd(), 'netlify', 'functions', 'dataCollection', `${region}.xlsx`);
    
    console.log('엑셀 파일 경로:', fullPath);
    
    // 파일 존재 여부 확인
    if (!existsSync(fullPath)) {
      console.log(`파일을 찾을 수 없음: ${fullPath}`);
      return {
        success: false,
        error: `File not found: ${fullPath}`
      };
    }
    
    // 엑셀 파일 읽기
    const workbook = readFile(fullPath);

    // 첫 번째 시트 선택
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // 시트 데이터를 JSON으로 변환
    const jsonData = utils.sheet_to_json(sheet);

    return {
      success: true,
      data: jsonData
    };
  } catch (error) {
    console.error(`Error reading Excel file for region ${region}:`, error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * 데이터 구조를 변환하는 함수
 * only 로컬에서 데이터 올리는 작업
 */
function transformData(data) {
  return data.map(item => {
    // 주소 필드 처리 (소재지도로명주소, 없을 경우 소재지지번주소 사용)
    const address = item['소재지도로명주소'] || item['소재지지번주소'] || '';
    
    // 개방시간상세와 개방시간 결합
    let accessInfo = '';
    const openTimeDetail = item['개방시간상세'] || '';
    const openTime = item['개방시간'] || '';
    
    if (openTimeDetail && openTime) {
      accessInfo = `${openTimeDetail}, ${openTime}`;
    } else if (openTimeDetail) {
      accessInfo = openTimeDetail;
    } else if (openTime) {
      accessInfo = openTime;
    }
    
    // 변환된 데이터 객체 반환
    return {
      type: item['구분'] || '',
      name: item['화장실명'] || '',
      address: address,
      management: item['관리기관명'] || '',
      tel: item['전화번호'] || '',
      access_info: accessInfo,
      installed_at: item['설치연월'] || '',
      lat: item['WGS84위도'] || '',
      lng: item['WGS84경도'] || '',
      type_detail: item['화장실소유구분'] || '',
      remodeled_at: item['리모델링연월'] || '',
      created_at: item['데이터기준일자'] || ''
    };
  });
}

exports.handler = async function(event, context) {

  // 화장실 데이터 출처
  // https://www.localdata.go.kr/lif/lifeCtacDataView.do

  throw new Error('데이터 추가는 로컬에서만 진행');

  try {

    // const regions = ['서울', '부산', '인천', '대구', '광주', '대전', '울산', '세종', '경기', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주']
    const regions = ['서울', '부산'] // 임시 테스트 용 (너무 많음)
    let rawData = [];

    for (const region of regions) { // 엑셀 파일 읽어오고 rawData에 모으기
      const result = await readExcelFile(region);
      console.log('엑셀 파일 읽기 결과:', result.success ? '성공' : '실패');
      if (result.success) {
        rawData.push(...result.data);
      }
    }

    // DB에 넣게 데이터 구조 변환
    const mappedData = transformData(rawData);
    console.log(`총 ${rawData.length}개 데이터를 변환했습니다.`);

    if (!mappedData.length) { // 읽기 에러 처리
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({ 
          error: `지역 데이터를 읽는 중 오류가 발생했습니다` 
        })
      };
    }

    for (const [index, item] of mappedData.entries()) {

      console.log('진행도 :', `${index+1} / ${mappedData.length}`);

      // 만약 좌표값이 없으면, 네이버 지오코딩 API 호출하고 좌표값 추가하기

      if (item.lat === "" || item.lng === "") {

        const response = await axios.get('https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode', {
          params: {
            query: item.address
          },
          headers: {
            'X-NCP-APIGW-API-KEY-ID': NAVER_CLIENT_ID,
            'X-NCP-APIGW-API-KEY': NAVER_CLIENT_SECRET,
            'Accept': 'application/json'
          }
        });

        try {
          const x = response.data.addresses[0].x;
          const y = response.data.addresses[0].y;
          // const address = response.data.addresses[0].roadAddress;

          item.lng = x; // 위도는 x축
          item.lat = y; // 경도는 y축
          
          // 지오코딩 API를 통해 좌표값을 얻은 후 데이터베이스에 upsert
          const { data, error } = await supabase
            .from('toilets')
            .upsert(item, {
              onConflict: ['name', 'address', 'management'] // 이름, 주소, 관리기관명에서 충돌 감지
            })
            .select();
            
          if (error) {
            console.error('지오코딩 후 데이터 저장 중 오류 발생:', error);
          }

        } catch (error) {
          console.error('지오코딩 API 호출 중 오류 발생:', error);

          // const errorData = rawData.find(data => data['소재지도로명주소'] === item.address || data['소재지지번주소'] === item.address)
          // console.log('오류가 발생한 원본 데이터:', errorData)

          const { data } = await supabase // 에러나는 주소 모아놓기
          .from('error_log')
          .upsert({
            name: item.name,
            address: item.address
          })
          // .select();
          continue;
        }

      } else {

        const { data, error } = await supabase
        .from('toilets')
        .upsert(item, {
          onConflict: ['name', 'address', 'management'] // 이름, 주소, 관리기관명에서 충돌 감지
        })
        .select();
      }

    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({
        success: true
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
