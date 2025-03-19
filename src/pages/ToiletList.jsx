// ToiletList.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MdMap, MdInfoOutline, MdMyLocation, MdSearch } from 'react-icons/md';
import SimpleAutocomplete from '../components/SimpleAutocomplete';
import useRegionStore from '../store/regionStore';
import useToiletStore from '../store/toiletStore';

export default function ToiletList() {

  const navigate = useNavigate();
  const [selectedToilet, setSelectedToilet] = useState(null);
  
  // Zustand 스토어
  const { location, setLocation } = useToiletStore();
  const { regions, fetchRegions } = useRegionStore();
  const { recentToilet } = useToiletStore();
  const { toilets, getToilets, resetToilets } = useToiletStore();

  const handleToiletClick = (id) => {
    if (selectedToilet === id) {
      setSelectedToilet(null);
    } else setSelectedToilet(id);
  };

  // 거리 표시 포맷팅
  const formatDistance = (meters) => {
    if (meters < 1000) {
      return `${Math.round(meters)}m`;
    } else {
      return `${(meters / 1000).toFixed(1)}km`;
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setLocation(latitude, longitude);
        getToilets();
      });
    }
  };
  
  useEffect(() => {
    fetchRegions();
  }, [fetchRegions]);

  useEffect(() => {
    getToilets();
  }, [getToilets]);

  return (
    <div id='root-container' className='flex flex-col w-[calc(90%)]'>
      <div id='toilet' className="container w-full h-[calc(100vh)] py-22 mx-auto flex justify-center items-center flex-col md:min-w-[768px]">
        <div className="w-full max-w-4xl py-4 flex items-center justify-between">
          <SimpleAutocomplete options={regions} className='content-center' />
          <button 
            className="ml-2 py-2 px-4 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors text-sm flex items-center"
            onClick={getCurrentLocation}  
          >
            <MdSearch className="h-5 w-5" />
          </button>
        </div>

        <div id='toilet-container' className="w-full h-full max-w-4xl bg-white rounded-lg shadow-lg flex flex-col">
          {/* 화장실 리스트 */}
          <div id='toilet-list' className='w-full h-full p-4 overflow-y-auto'>
            {toilets.length > 0 ? (
              <ul className="space-y-2">
                {toilets.map((item) => (
                  <li
                    key={item.id}
                    data-id={item.id}
                    className="p-3 bg-gray-50 rounded-md shadow-sm hover:bg-gray-100 cursor-pointer transition-colors"
                    style={selectedToilet === item.id ? { backgroundColor: '#e5e7eb' } : {}}
                    onClick={() => handleToiletClick(item.id)}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-sm text-blue-600 font-medium">{formatDistance(item.distance)}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{item.address}</p>
                    <div className="flex justify-between mt-2">
                      <span className="text-sm text-gray-500">{item.management}</span>
                      <span className="text-sm text-gray-500">{item.tel || '전화번호 없음'}</span>
                    </div>
                  </li>
                ))}
                <li id='toilet-loading'></li>
              </ul>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <div className="w-24 h-24 mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <MdMyLocation className="h-10 w-10 text-gray-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-700 mb-2">주변 화장실을 찾을 수 없습니다</h2>
                <p className="text-gray-500 mb-6">주소 입력 또는 위치 정보를 허용하여 주변 화장실을 찾아보세요.</p>
                <button 
                  className="py-3 px-6 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors flex items-center cursor-pointer"
                  onClick={getCurrentLocation}
                >
                  <MdMyLocation className="h-5 w-5 mr-2" />
                  현재 위치 사용하기
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 선택된 화장실이 있을 때 나타나는 하단 버튼 */}
      {selectedToilet && (
        <div className="absolute bottom-0 left-0 right-0 w-full p-8 flex justify-center gap-4 fade-in">
          <button
            className="py-3 px-6 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-colors flex items-center cursor-pointer"
            onClick={() => {
              // 지도 보기 기능으로 이동
              navigate(`/map/${selectedToilet}`);
            }}
          >
            <MdMap className="h-5 w-5 mr-2" />
            지도 보기
          </button>
          <button
            className="py-3 px-6 bg-gray-100 text-gray-800 rounded-lg shadow-md hover:bg-gray-200 transition-colors flex items-center cursor-pointer"
            onClick={() => {
              // 상세 정보 보기 기능 구현
              navigate(`/detail/${selectedToilet}`);
            }}
          >
            <MdInfoOutline className="h-5 w-5 mr-2" />
            자세히 보기
          </button>
        </div>
      )}
    </div>
  );
}
