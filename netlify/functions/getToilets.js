import { createClient } from '@supabase/supabase-js'

// Supabase 설정
const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

exports.handler = async function(event, context) {
  try {

    // 전체 데이터 수 조회
    const { count, error: countError } = await supabase
      .from('toilets')
      .select('*', { count: 'exact', head: true });
    
    if (countError) throw countError;

    console.log(`총 데이터 수: ${count}`);

    // 필요한 페이지 수 계산 (1000개씩 나눠서)
    const totalPages = Math.ceil(count / 1000);
    let allData = [];

    // // 모든 데이터를 1000개씩 나눠서 가져오기
    for (let i = 0; i < 7; i++) {
      
      let query = supabase
        .from('toilets')
        .select('*')
        .order('id', 'desc')
        .range(1000 * i, 1000 * (i+1))

        // 0 1000
        // 1000 2000
      
      const { data, error } = await query;

      if (error) throw error;

      // 배열 합치기 (올바른 방법)
      allData = [...allData, ...data];
      console.log(`현재까지 로딩된 모든 데이터 수: ${allData.length}`);
    }

    const filteredData = allData.filter((data) => data.lat == "" || data.lat === "")

    console.log(`필터링된 데이터 수: ${filteredData.length}`)

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
        data: filteredData,
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
