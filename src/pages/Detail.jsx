import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Detail() {
  const { id } = useParams(); // URL에서 id 값을 가져옵니다.
  const navigate = useNavigate();
  const [selectedToiletInfo, setSelectedToiletInfo] = useState(null);

  // CSV 파일에서 가져온 화장실 데이터 (실제로는 API나 데이터베이스에서 가져올 것입니다)
  const items = [
    {
      id: 1,
      type: "개방화장실",
      name: "산호빌딩",
      address_1: "서울특별시 금천구 벚꽃로38길 15",
      address_2: "",
      management: "서울특별시 금천구청",
      phone: "02-2627-1475",
      schedule_1: "",
      schedule_2: "24시간",
      installation_date: "1983-10",
      lat: "37.48215245",
      lng: "126.8839528",
      owner: "공공기관-지방공공기관(지방공기업/지방출자출연기관)",
      updated_at: "2020-07-31"
    },
    {
      id: 2,
      type: "개방화장실",
      name: "대명합동시장",
      address_1: "서울특별시 금천구 시흥동 884-4",
      address_2: "",
      management: "서울특별시 금천구청",
      phone: "02-2627-1475",
      schedule_1: "",
      schedule_2: "07:00~24:00",
      installation_date: "2020-01",
      lat: "37.45428665",
      lng: "126.9018183",
      owner: "공공기관-지방공공기관(지방공기업/지방출자출연기관)",
      updated_at: "2020-07-31"
    },
    // 나머지 데이터는 생략
  ];

  // 선택된 화장실 ID에 따라 화장실 정보를 불러옴
  useEffect(() => {
    if (id) {
      const toiletId = parseInt(id);
      const toiletInfo = items.find(item => item.id === toiletId);
      setSelectedToiletInfo(toiletInfo);
    }
  }, [id]);

  // 목록 화면으로 돌아가기
  const handleBackToList = () => {
    navigate(`/list?selected=${id}`);
  };

  return (
    <div className="container mx-auto p-4 flex justify-center items-center flex-col">
      {selectedToiletInfo ? (
        <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">{selectedToiletInfo.name}</h1>
            <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              {selectedToiletInfo.type}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">위치 정보</h2>
              <p className="text-gray-700 mb-1">
                <span className="font-medium">주소:</span> {selectedToiletInfo.address_1 || selectedToiletInfo.address_2}
              </p>
              <p className="text-gray-700 mb-1">
                <span className="font-medium">위도:</span> {selectedToiletInfo.lat}
              </p>
              <p className="text-gray-700 mb-1">
                <span className="font-medium">경도:</span> {selectedToiletInfo.lng}
              </p>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold mb-2">운영 정보</h2>
              <p className="text-gray-700 mb-1">
                <span className="font-medium">운영 시간:</span> {selectedToiletInfo.schedule_2}
              </p>
              <p className="text-gray-700 mb-1">
                <span className="font-medium">관리 기관:</span> {selectedToiletInfo.management}
              </p>
              <p className="text-gray-700 mb-1">
                <span className="font-medium">연락처:</span> {selectedToiletInfo.phone}
              </p>
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">추가 정보</h2>
            <p className="text-gray-700 mb-1">
              <span className="font-medium">설치 일자:</span> {selectedToiletInfo.installation_date}
            </p>
            <p className="text-gray-700 mb-1">
              <span className="font-medium">소유자:</span> {selectedToiletInfo.owner}
            </p>
            <p className="text-gray-700 mb-1">
              <span className="font-medium">최종 업데이트:</span> {selectedToiletInfo.updated_at}
            </p>
          </div>
          
          <div className="flex justify-between">
            <button 
              onClick={handleBackToList}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              목록으로 돌아가기
            </button>
            <button 
              onClick={() => navigate(`/map/${selectedToiletInfo.id}`)}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              지도에서 보기
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6 text-center">
          <p className="text-xl text-gray-700">화장실 정보를 불러오는 중입니다...</p>
          <button 
            onClick={handleBackToList}
            className="mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            목록으로 돌아가기
          </button>
        </div>
      )}
    </div>
  );
}
