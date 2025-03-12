exports.handler = async function(event, context) {
  
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    },
    body: JSON.stringify({
      message: "안녕하세요! 이것은 서버리스 함수 테스트입니다."
    })
  };
}
