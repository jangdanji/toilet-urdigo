// ToiletList.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MdMap, MdInfoOutline, MdMyLocation, MdSearch } from 'react-icons/md';
import { LuToilet } from "react-icons/lu";
import { ToiletListSEO } from '../components/SEO';
import SimpleAutocomplete from '../components/SimpleAutocomplete';
import useToiletStore from '../store/toiletStore';
import Loading from '../components/Loading'; // 로딩 컴포넌트 추가
import styled from 'styled-components';


export const StyledBackground = styled.div`
  background-image: url("/.netlify/functions/getMap");
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  filter: blur(10px);
`;

export default function ToiletList() {

  const navigate = useNavigate();
  
  // Zustand 스토어
  const {
    toilets,
    getToilets,
    currentPage,
    hasMoreData,
    selectedToilet,
    setSelectedToilet,
    setCurrentAddress,
    updateCurrentAddress,
    isLoadingGlobal,
    address,
    isLoadingToiletList
  } = useToiletStore();

  // 스크롤 감지를 위한 ref
  const observerRef = useRef(null);
  const loadingRef = useRef(null);
  const toiletListRef = useRef(null); // 화장실 목록 컨테이너의 ref

  const handleToiletClick = (toilet) => {
    if (selectedToilet?.id === toilet.id) {
      setSelectedToilet(null);
    } else {
      setSelectedToilet(toilet);
    }
  };

  // 거리 표시 포맷팅
  const formatDistance = (meters) => {
    if (meters < 1000) {
      return `${Math.round(meters)}m`;
    } else {
      return `${(meters / 1000).toFixed(1)}km`;
    }
  };

  const saveScrollPosition = () => {
    localStorage.setItem('toiletListScrollPosition', toiletListRef.current.scrollTop);
  }

  useEffect(() => { // 뒤로가기로 이곳에 이동할 때 스크롤 위치 복구
    const position = localStorage.getItem('toiletListScrollPosition');

    if (position && toilets.length > 0) { // 데이터가 있는 경우만
      toiletListRef.current.scrollTop = parseInt(position);
    } else localStorage.removeItem('toiletListScrollPosition');
  }, [])
    
  // 추가 데이터 로드
  const loadMoreToilets = async () => {
    console.log('loadMoreToilets 호출');

    if (!isLoadingToiletList && hasMoreData) {
      await getToilets(currentPage + 1);
    }
  };

  // Intersection Observer 설정
  useEffect(() => {
    const options = {
      root: null, // viewport를 root로 사용
      rootMargin: '0px',
      threshold: 1, // 100% 보이면 콜백 실행
    };

    const observer = new IntersectionObserver((entries) => {
      console.log('entries', entries)
      if (entries[0].isIntersecting && hasMoreData && !isLoadingToiletList && toilets.length > 0) {
        loadMoreToilets();
      }
    }, options);

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMoreToilets, hasMoreData, isLoadingToiletList]);

  // useEffect(() => { // 좌표가 업데이트되면 다시 화장실 데이터 가져오기
  //   console.log('location', location)

  //   const newAddressUpdateFunction = async () => {
  //     await getToilets(1);
  //   }

  //   if (location.lat && location.lng && address) {
  //     newAddressUpdateFunction();
  //   }
  // }, [address]);

  useEffect(() => { // 선택된 화장실 데이터 변경 시 (디버깅용)
    console.log('selectedToilet', selectedToilet);
  }, [selectedToilet]);

  useEffect(() => {
    console.log('currentPage', currentPage);
  }, [currentPage]);

  const handleResetScrollTop = () => {
    toiletListRef.current.scrollTop = 0;
  };

  return (
    <div id='root-container' className='flex flex-col w-[calc(90%)]'>
      <ToiletListSEO address={address} />
      
      <StyledBackground id='background' className='w-full h-full opacity-50' />
      {isLoadingGlobal &&<Loading message="페이지 로딩 중" />}
      <div id='toilet' className="container w-full h-[calc(100vh)] py-22 mx-auto flex justify-center items-center flex-col md:min-w-[768px] z-10">
        <div className="w-full max-w-4xl py-4 flex items-center justify-between">
          <SimpleAutocomplete
            value={address}
            className='content-center'
            onSelect={() => handleResetScrollTop()}
          />
          <button 
            className="ml-2 py-2 px-4 bg-indigo-500 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-colors text-sm flex items-center cursor-pointer"
            onClick={() => {updateCurrentAddress(); handleResetScrollTop();}}  
            title="현재 위치로 검색"
          >
            <MdMyLocation className="h-4 w-4" />
          </button>
        </div>

        <div id='toilet-container' className="w-full h-full min-h-full max-w-4xl bg-white rounded-lg shadow-lg flex flex-col">
          {/* 화장실 리스트 */}
          <div 
            id='toilet-list' 
            className='w-full h-full min-h-full p-4 overflow-y-auto'
            ref={toiletListRef}
          >
            {toilets.length > 0 ? (
              <ul className="space-y-2 h-full min-h-full">
                {toilets.map((toilet) => (
                  <li
                      // key={toilet.id}
                      data-id={toilet.id}
                      className={`p-3 rounded-md shadow-sm cursor-pointer transition-colors`}
                      onClick={() => handleToiletClick(toilet)}
                      style={{
                        backgroundColor: selectedToilet?.id == toilet.id ? '#e5e7eb' : '#f9fafb'
                      }}
                    >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{toilet.name}</span>
                      <span className="text-sm text-indigo-500 font-medium">{formatDistance(toilet.distance)}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{toilet.address}</p>
                    <div className="flex justify-between mt-2">
                      <span className="text-sm text-gray-500">{toilet.management}</span>
                      <span className="text-sm text-gray-500">{toilet.tel || '전화번호 없음'}</span>
                    </div>
                  </li>
                ))}
                
                {/* 로딩 표시 및 Intersection Observer 타겟 */}
                <li id='toilet-loading' ref={loadingRef} className="py-4 text-center">
                  {isLoadingToiletList && (
                    <div className="flex justify-center items-center py-2">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                    </div>
                  )}
                  {!hasMoreData && toilets.length > 0 && (
                    <p className="text-gray-500">더 이상 표시할 화장실이 없습니다</p>
                  )}
                </li>
              </ul>
            ) : (!isLoadingGlobal &&
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <div className="w-24 h-24 mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <LuToilet className="h-10 w-10 text-gray-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-700 mb-2">주변 화장실을 찾을 수 있습니다!</h2>
                <p className="text-gray-500 mb-6">주소 입력 또는 위치 정보를 허용하여 주변 화장실을 찾아보세요.</p>
                <button 
                  className="py-3 px-6 bg-indigo-500 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-colors flex items-center cursor-pointer"
                  onClick={setCurrentAddress}
                >
                  <MdMyLocation className="h-5 w-5 mr-2" />
                  현재 위치 사용하기
                </button>
                {/* 빈 상태에서도 Intersection Observer가 작동하도록 숨겨진 요소 추가 */}
                <div id="empty-state-loading" ref={loadingRef} className="mt-10 invisible h-1"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 선택된 화장실이 있을 때 나타나는 하단 버튼 */}
      {selectedToilet?.id && (
        <div className="absolute bottom-0 left-0 right-0 w-full p-8 flex justify-center gap-4 fade-in z-11">
          <button
            className="py-3.5 px-8 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-full shadow-lg hover:from-indigo-600 hover:to-indigo-700 hover:shadow-xl transition-all transform hover:scale-105 duration-200 flex items-center cursor-pointer"
            onClick={() => {
              // 스크롤 위치 저장 후 지도 보기 페이지로 이동
              saveScrollPosition();
              navigate(`/map/${selectedToilet?.id}`);
            }}
          >
            <MdMap className="h-6 w-6 mr-2 animate-pulse" />
            <span className="font-medium">지도 보기</span>
          </button>
        </div>
      )}
    </div>
  );
}
