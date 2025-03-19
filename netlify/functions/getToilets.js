import { getToilets } from './api';

export const handler = async (event, context) => {

  const lat = event.queryStringParameters.lat || 35.14960599852979;
  const lng = event.queryStringParameters.lng || 129.0134442513272;

  // PostGIS 포인트 형식으로 전달 (limit_count 이름 주의)
  const params = {
    point : `SRID=4326;POINT(${lng} ${lat})`,
    page : event.queryStringParameters.page || 1,
    limit_count : event.queryStringParameters.limit || 10
  }

  const { data, error } = await getToilets(params);

  if (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ data }),
  };
};
