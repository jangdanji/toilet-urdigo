// MapView.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useToiletStore from '../store/toiletStore';

export default function MapView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedToiletInfo, setSelectedToiletInfo] = useState(null);

  const { setRecentToilet } = useToiletStore();

  useEffect(() => {
    setRecentToilet(id);
  }, [id]);

  // CSV 파일에서 가져온 화장실 데이터
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
    {
      id: 3,
      type: "공중화장실",
      name: "종합청사",
      address_1: "서울특별시 금천구 시흥대로73길 70",
      address_2: "서울특별시 금천구 시흥동 1020",
      management: "서울특별시 금천구청",
      phone: "02-2627-1003",
      schedule_1: "",
      schedule_2: "24시간",
      installation_date: "2020-03",
      lat: "37.45706511",
      lng: "126.8960352",
      owner: "공공기관-지방자치단체",
      updated_at: "2020-07-31"
    },
    {
      id: 4,
      type: "공중화장실",
      name: "기아대교",
      address_1: "",
      address_2: "서울특별시 금천구 시흥동 766-5",
      management: "서울특별시 금천구청",
      phone: "02-2627-1862",
      schedule_1: "",
      schedule_2: "24시간",
      installation_date: "2020-03",
      lat: "37.4399576",
      lng: "126.9007057",
      owner: "공공기관-지방자치단체",
      updated_at: "2020-07-31"
    },
    {
      id: 5,
      type: "공중화장실",
      name: "시흥대교",
      address_1: "",
      address_2: "서울특별시 금천구 시흥동 784-21",
      management: "서울특별시 금천구청",
      phone: "02-2627-1862",
      schedule_1: "",
      schedule_2: "24시간",
      installation_date: "2020-03",
      lat: "37.4489203",
      lng: "126.8967444",
      owner: "공공기관-지방자치단체",
      updated_at: "2020-07-31"
    },
    {
      id: 6,
      type: "공중화장실",
      name: "금천구청역 뒤",
      address_1: "",
      address_2: "서울특별시 금천구 독산동 732-3",
      management: "서울특별시 금천구청",
      phone: "02-2627-1862",
      schedule_1: "",
      schedule_2: "24시간",
      installation_date: "2020-02",
      lat: "37.4553281",
      lng: "126.8936166",
      owner: "공공기관-지방자치단체",
      updated_at: "2020-07-31"
    },
    {
      id: 7,
      type: "공중화장실",
      name: "자전거보관소",
      address_1: "",
      address_2: "서울특별시 금천구 독산동 727-2",
      management: "서울특별시 금천구청",
      phone: "02-2627-1862",
      schedule_1: "",
      schedule_2: "24시간",
      installation_date: "2020-01",
      lat: "37.4566535",
      lng: "126.8930308",
      owner: "공공기관-지방자치단체",
      updated_at: "2020-07-31"
    },
    {
      id: 8,
      type: "공중화장실",
      name: "금천교",
      address_1: "",
      address_2: "서울특별시 금천구 가산동 707-3",
      management: "서울특별시 금천구청",
      phone: "02-2627-1862",
      schedule_1: "",
      schedule_2: "24시간",
      installation_date: "2020-03",
      lat: "37.4654584",
      lng: "126.8854471",
      owner: "공공기관-지방자치단체",
      updated_at: "2020-07-31"
    },
    {
      id: 9,
      type: "공중화장실",
      name: "대륭테크노타운 앞",
      address_1: "",
      address_2: "서울특별시 금천구 가산동 340-5",
      management: "서울특별시 금천구청",
      phone: "02-2627-1862",
      schedule_1: "",
      schedule_2: "24시간",
      installation_date: "2020-04",
      lat: "37.4683556",
      lng: "126.8836688",
      owner: "공공기관-지방자치단체",
      updated_at: "2020-07-31"
    },
    {
      id: 10,
      type: "공중화장실",
      name: "철산교",
      address_1: "",
      address_2: "서울특별시 금천구 가산동 614-45",
      management: "서울특별시 금천구청",
      phone: "02-2627-1862",
      schedule_1: "",
      schedule_2: "24시간",
      installation_date: "2020-05",
      lat: "37.4787197",
      lng: "126.8757179",
      owner: "공공기관-지방자치단체",
      updated_at: "2020-07-31"
    }
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
    <div className="w-full h-screen max-w-[1920px] mx-auto bg-gray-100 absolute top-0 left-0 bottom-0 right-0 fade-in">
      {/* 여기에 지도가 들어갈 예정 */}
      <div className="absolute top-4 left-4 z-10">
        <button 
          className="py-2 px-4 bg-white rounded-lg shadow-md hover:bg-gray-100 transition-colors flex items-center"
          onClick={handleBackToList}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          뒤로 가기
        </button>
      </div>
      
      {/* 선택된 화장실 정보 (왼쪽 하단) */}
      {selectedToiletInfo && (
        <div className="absolute bottom-4 left-4 p-4 bg-white rounded-lg shadow-lg max-w-sm z-10 animate-slide-up">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-lg">{selectedToiletInfo.name}</h3>
            <span className="text-sm bg-green-100 text-green-800 py-1 px-2 rounded">{selectedToiletInfo.type}</span>
          </div>
          <p className="text-sm text-gray-700 mb-2">{selectedToiletInfo.address_1 || selectedToiletInfo.address_2}</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{selectedToiletInfo.schedule_2}</span>
            </div>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>{selectedToiletInfo.phone}</span>
            </div>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{selectedToiletInfo.installation_date}</span>
            </div>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span>{selectedToiletInfo.management}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
