// MapView.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useToiletStore from '../store/toiletStore';
import DynamicMap from '../components/DynamicMap';
import { MapViewSEO } from '../components/SEO';
import {
  MdLocationOn,
  MdAccessTime,
  MdPhone,
  MdBusinessCenter,
  MdOutlineKeyboardDoubleArrowDown,
  MdOutlineKeyboardDoubleArrowUp,
  MdInfoOutline,
  MdArrowBack,
  MdInfo
} from 'react-icons/md';


export default function MapView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [infoView, setInfoView] = useState(true);

  const { selectedToilet, getToiletDetail } = useToiletStore();

  useEffect(() => {
    if (id) {
      getToiletDetail(id);
    } else {
      navigate(`/`);
    }
  }, [id]);

  useEffect(() => {
    if (!selectedToilet) {
      navigate(`/`);
    }
  }, [selectedToilet]);

  const handleBackToList = () => {
    navigate(`/`);
  };

  const handleViewDetail = () => {  
    navigate(`/detail/${id}`);
  };

  return (
    <div className="w-full h-screen max-w-[1920px] mx-auto bg-gray-100 absolute top-0 left-0 bottom-0 right-0 fade-in">
      <MapViewSEO selectedToilet={selectedToilet} id={id} />
      
      {/* 화장실 정보 (왼쪽 상단) */}
      {(
        <div className="absolute left-4 top-4 md:max-w-md w-[calc(100%-2rem)] bg-white/95 backdrop-blur-sm rounded-xl shadow-xl z-10 transition-all duration-300 border border-gray-100">
          <div className="flex justify-between items-center w-full border-b pb-3 pt-4 px-5">
            <h3 className="font-bold text-lg truncate">{selectedToilet.name}</h3>
            <button 
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center cursor-pointer"
              onClick={() => setInfoView(!infoView)}
              aria-label={infoView ? "정보 접기" : "정보 펼치기"}
            >
              {infoView ? (
                <MdOutlineKeyboardDoubleArrowUp className="h-5 w-5 text-gray-600" />
              ) : (
                <MdOutlineKeyboardDoubleArrowDown className="h-5 w-5 text-gray-600" />
              )}
            </button>
          </div>

          {infoView && (
            <div className="space-y-2 text-sm p-4">
              <div className="flex items-center gap-2">
                <MdLocationOn className="text-gray-500" size={20} />
                <p className="text-gray-700">{selectedToilet.address || '주소 정보 없음'}</p>
              </div>
              
              <div className="flex items-center gap-2">
                <MdAccessTime className="text-gray-500" size={20} />
                <div>
                  <p className="text-gray-700">{selectedToilet.access_info || '이용 시간 정보 없음'}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <MdBusinessCenter className="text-gray-500" size={20} />
                <div className="flex flex-wrap items-center">
                  <p className="text-gray-700 mr-1">{selectedToilet.management || '관리 기관 정보 없음'}</p>
                  {selectedToilet.tel && (
                    <span className="flex items-center text-gray-600">
                      ({selectedToilet.tel})
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="px-5 py-4 bg-gray-50 rounded-b-xl">

            <div className="space-y-1">
              <p className="text-xs text-gray-500 flex items-center">
                <span className="inline-block w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                정확한 위치, 정보가 아닐 수 있습니다.
              </p>
              <p className="text-xs text-gray-500 flex items-center">
                <span className="inline-block w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                민간화장실일 경우 관계자의 양해를 구해주세요.
              </p>
            </div>
          </div>
        </div>
      )}

      {selectedToilet?.lat && selectedToilet?.lng && <DynamicMap lat={selectedToilet?.lat} lng={selectedToilet?.lng} />}

      {/* 하단 버튼 영역 */}
      <div className="absolute w-full bottom-6 right-1/2 transform translate-x-1/2 z-10 flex justify-center space-x-3">
        <button 
          className="py-3 px-6 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-full shadow-lg hover:from-indigo-600 hover:to-indigo-700 hover:shadow-xl transition-all transform hover:scale-105 duration-200 flex items-center cursor-pointer"
          onClick={handleViewDetail}
        >
          <MdInfoOutline className="h-5 w-5 mr-2" />
          <span className="font-medium">자세히 보기</span>
        </button>
        <button 
          className="py-3 px-6 bg-white text-gray-700 rounded-full shadow-lg hover:bg-gray-50 hover:shadow-xl transition-all transform hover:scale-105 duration-200 flex items-center cursor-pointer"
          onClick={handleBackToList}
        >
          <MdArrowBack className="h-5 w-5 mr-2" />
          <span className="font-medium">뒤로 가기</span>
        </button>
      </div>
    </div>
  );
}
