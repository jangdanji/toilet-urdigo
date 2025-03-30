import { getToilets } from './api';

export const handler = async (event, context) => {

  const lat = event.queryStringParameters.lat || 35.14960599852979;
  const lng = event.queryStringParameters.lng || 129.0134442513272;
  const page = parseInt(event.queryStringParameters.page) || 1;
  const limit = parseInt(event.queryStringParameters.limit) || 10;

  // PostGIS 포인트 형식으로 전달 (limit_count 이름 주의)
  const params = {
    point : `SRID=4326;POINT(${lng} ${lat})`,
    page : page,
    limit_count : limit
  }

  const { data, error } = await getToilets(params);

  if (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }

  // 페이지네이션 메타데이터 추가
  const pagination = {
    page: page,
    limit: limit,
    hasMore: data.length === limit // 요청한 limit보다 적은 데이터가 오면 더 이상 데이터가 없다고 판단
  };

  return {
    statusCode: 200,
    body: JSON.stringify({ 
      data,
      pagination
    }),
  };
};
