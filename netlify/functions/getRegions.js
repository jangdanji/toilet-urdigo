import { getRegions } from './api';

export const handler = async (event, context) => {
  
  const { data, error } = await getRegions();

  if (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };  
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ data })
  };
};