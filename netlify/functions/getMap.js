import { getMap } from './api';

export const handler = async (event, context) => {

  const result = await getMap();
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'image/jpeg'
    },
    body: result,
    isBase64Encoded: true
  };
};