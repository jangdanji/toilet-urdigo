import { getToiletDetails } from './api';

export const handler = async (event, context) => {

  const { id } = event.queryStringParameters;
  const { data, error } = await getToiletDetails(id);
  if (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
};