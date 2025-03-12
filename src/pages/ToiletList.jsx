// ToiletList.jsx
import React, { useState, useEffect } from 'react';
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useNavigate, useLocation } from 'react-router-dom';

export default function ToiletList() {
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

  const navigate = useNavigate();
  const location = useLocation();
  const [selectedToilet, setSelectedToilet] = useState(null);
  const [openStatus, setOpenStatus] = useState("all"); // 개방 상태 필터 (all, open, closed, unknown)
  
  // URL 쿼리 파라미터에서 선택된 화장실 ID 가져오기
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const selected = queryParams.get('selected');
    
    if (selected) {
      const toiletId = parseInt(selected);
      setSelectedToilet(toiletId);
      
      // 선택된 화장실로 스크롤
      setTimeout(() => {
        const element = document.querySelector(`[data-id="${toiletId}"]`);
        if (element) {
          element.scrollIntoView({ behavior: 'instant' });
        }
      }, 0);
    }
  }, [location.search]);

  const handleToiletClick = (id) => {
    if (selectedToilet === id) {
      setSelectedToilet(null);
    } else setSelectedToilet(id);
  };

  return (
    <div id='toilet' className="container mx-auto p-4 flex justify-center items-center flex-col md:min-w-[768px]">
      {/* 상위 직사각형 박스 */}
      <div id='toilet-container' className="w-full h-[calc(100vh-4rem)] md:h-full max-w-4xl bg-white rounded-lg shadow-lg flex flex-col md:flex-row overflow-hidden">
        {/* 좌측: 스크롤 가능한 리스트 */}
        <div id='toilet-list' className='w-full h-full md:w-5/7 md:h-[500px] border-b md:border-b-0 md:border-r border-gray-200 p-4'>
          <div className='px-2 pb-4 pt-2'>
            <h2 className='text-2xl font-semibold text-center'>가까운 화장실</h2>
          </div>
          <div className="h-[calc(100%-4rem)] overflow-y-auto">
            <ul className="space-y-2">
              {items.map((item, index) => (
                <li
                  key={index}
                  data-id={item.id}
                  className="p-3 bg-gray-50 rounded-md shadow-sm hover:bg-gray-100 cursor-pointer transition-colors"
                  style={selectedToilet === item.id ? { backgroundColor: '#e5e7eb' } : {}}
                  onClick={() => handleToiletClick(item.id)}
                >
                  <div className="flex justify-between">
                    <span className="font-medium">{item.name}</span>
                    <span className="text-sm text-gray-500">{item.type}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{item.address_1 || item.address_2}</p>
                  {/* <p className="text-xs text-gray-500 mt-1">운영시간: {item.schedule_2}</p> */}
                  <div className="flex justify-between mt-2">
                    <span className="text-sm text-gray-500">관리: {item.management}</span>
                    <span className="text-sm text-gray-500">전화: {item.phone}</span>
                  </div>
                </li>
              ))}
              <li id='toilet-loading'></li>
            </ul>
          </div>
        </div>

        <div className='md:w-2/7 p-4 hidden md:flex flex-col justify-evenly'>
          <div className='space-y-6'>
            <div>
              <h3 className="mb-4 text-md font-bold">개방 상태</h3>
              <RadioGroup defaultValue="all" value={openStatus} onValueChange={setOpenStatus}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="open" id="open-status" />
                  <Label htmlFor="open-status">개방 중</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="closed" id="closed-status" />
                  <Label htmlFor="closed-status">개방시간 아님</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="unknown" id="unknown-status" />
                  <Label htmlFor="unknown-status">미확인</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <h3 className="mb-4 text-md font-bold">화장실 유형</h3>
              <RadioGroup defaultValue="comfortable">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="default" id="r1" />
                  <Label htmlFor="r1">공중화장실</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="comfortable" id="r2" />
                  <Label htmlFor="r2">개방화장실</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="compact" id="r3" />
                  <Label htmlFor="r3">민간화장실</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>
      </div>

      {/* 선택된 화장실이 있을 때 나타나는 하단 버튼 */}
      {selectedToilet && (
        <div className="fixed bottom-0 left-0 right-0 p-8 flex justify-center gap-4 animate-slide-up">
          <button 
            className="py-3 px-6 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-colors flex items-center cursor-pointer"
            onClick={() => {
              // 지도 보기 기능으로 이동
              navigate(`/map/${selectedToilet}`);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            지도 보기
          </button>
          <button 
            className="py-3 px-6 bg-gray-100 text-gray-800 rounded-lg shadow-md hover:bg-gray-200 transition-colors flex items-center cursor-pointer"
            onClick={() => {
              // 상세 정보 보기 기능 구현
              navigate(`/detail/${selectedToilet}`);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            자세히 보기
          </button>
        </div>
      )}
    </div>
  );
}
