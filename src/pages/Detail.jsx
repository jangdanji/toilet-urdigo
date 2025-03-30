import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import useToiletStore from '../store/toiletStore';
import Loading from '../components/Loading';
import { 
  MdArrowBack, 
  MdLocationOn, 
  MdAccessTime, 
  MdBusinessCenter, 
  MdPhone, 
  MdMap, 
  MdCalendarToday,
  MdConstruction,
  MdUpdate,
  MdMyLocation,
  MdInfo
} from 'react-icons/md';
import { StyledBackground } from '../pages/ToiletList';
import { DetailSEO } from '../components/SEO';

export default function Detail() {
  const { id } = useParams(); // URL에서 id 값을 가져옵니다.
  const navigate = useNavigate();

  const { selectedToilet, getToiletDetail, isLoadingGlobal } = useToiletStore();

  useEffect(() => {
    if (id) {
      getToiletDetail(id);
    } else {
      navigate('/');
    }
  }, [id, getToiletDetail, navigate]);

  // 목록 화면으로 돌아가기
  const handleBackToList = () => {
    navigate(-1); // 브라우저 히스토리의 이전 페이지로 이동
  };

  if (isLoadingGlobal) {
    return <Loading message="화장실 정보를 불러오는 중입니다..." />;
  }

  if (!selectedToilet || !selectedToilet.id) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center flex-col h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">화장실 정보를 찾을 수 없습니다.</h2>
          <button 
            onClick={handleBackToList}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <MdArrowBack /> 목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen max-w-[1920px] mx-auto bg-white absolute top-0 left-0 bottom-0 right-0 overflow-auto flex flex-col md:justify-center items-center">
      <StyledBackground className='opacity-50' />
      <DetailSEO selectedToilet={selectedToilet} id={id} />
      <div className="max-w-3xl w-full h-content overflow-y-auto h-full md:h-auto p-4 bg-white border md:rounded-lg shadow-lg z-10">
        <div className="flex items-center border-b mb-4 pb-3">
          <button 
            onClick={handleBackToList}
            className="mr-4 text-gray-700 hover:text-gray-900 cursor-pointer"
          >
            <MdArrowBack size={24} />
          </button>
          <h1 className="text-xl font-bold truncate">{selectedToilet.name}</h1>
        </div>
        <div className="px-1">
          {/* 타입 정보 */}
          <div className="mb-4 flex flex-wrap gap-2">
            {selectedToilet.type && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {selectedToilet.type}
              </span>
            )}
            {selectedToilet.type_detail && (
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                {selectedToilet.type_detail}
              </span>
            )}
          </div>
          
          {/* 주소 정보 */}
          <div className="mb-3 bg-gray-50 p-4 rounded-lg">
            <div className="flex items-start">
              <MdLocationOn className="text-gray-500 mr-2 mt-1 min-w-[20px]" size={20} />
              <p className="text-gray-700">{selectedToilet.address || '정보 없음'}</p>
            </div>
          </div>
          
          {/* 운영 정보 */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3 border-b pb-2">운영 정보</h2>
            
            <div className="space-y-3">
              {selectedToilet.access_info && (
                <div className="flex items-start">
                  <MdAccessTime className="text-gray-500 mr-2 mt-1 min-w-[20px]" size={20} />
                  <div>
                    <p className="font-medium">이용 시간</p>
                    <p className="text-gray-700">{selectedToilet.access_info}</p>
                  </div>
                </div>
              )}
              
              {selectedToilet.management && (
                <div className="flex items-start">
                  <MdBusinessCenter className="text-gray-500 mr-2 mt-1 min-w-[20px]" size={20} />
                  <div>
                    <p className="font-medium">관리 기관</p>
                    <p className="text-gray-700">{selectedToilet.management}</p>
                  </div>
                </div>
              )}
              
              {selectedToilet.tel && (
                <div className="flex items-start">
                  <MdPhone className="text-gray-500 mr-2 mt-1 min-w-[20px]" size={20} />
                  <div>
                    <p className="font-medium">연락처</p>
                    <p className="text-gray-700">{selectedToilet.tel}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* 추가 정보 */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3 border-b pb-2">추가 정보</h2>
            <div className="space-y-3">
              {selectedToilet.installed_at && (
                <div className="flex items-start">
                  <MdCalendarToday className="text-gray-500 mr-2 mt-1 min-w-[20px]" size={20} />
                  <div>
                    <p className="font-medium">설치 일자</p>
                    <p className="text-gray-700">{selectedToilet.installed_at}</p>
                  </div>
                </div>
              )}
              
              {selectedToilet.remodeled_at && (
                <div className="flex items-start">
                  <MdConstruction className="text-gray-500 mr-2 mt-1 min-w-[20px]" size={20} />
                  <div>
                    <p className="font-medium">리모델링</p>
                    <p className="text-gray-700">{selectedToilet.remodeled_at}</p>
                  </div>
                </div>
              )}
              
              {selectedToilet.created_at && (
                <div className="flex items-start">
                  <MdUpdate className="text-gray-500 mr-2 mt-1 min-w-[20px]" size={20} />
                  <div>
                    <p className="font-medium">데이터 업데이트</p>
                    <p className="text-gray-700">{selectedToilet.created_at}</p>
                  </div>
                </div>
              )}
              
              <div className="flex items-start">
                <MdMyLocation className="text-gray-500 mr-2 mt-1 min-w-[20px]" size={20} />
                <div>
                  <p className="font-medium">좌표</p>
                  <p className="text-gray-700">
                    {selectedToilet.lat && selectedToilet.lng 
                      ? `${selectedToilet.lat}, ${selectedToilet.lng}` 
                      : '정보 없음'}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* 참고 사항 */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-sm font-semibold mb-2 flex items-center">
              <MdInfo className="text-gray-500 mr-1" size={18} />
              참고 사항
            </h2>
            <div className="space-y-1">
              <p className="text-xs text-gray-500 flex items-center">
                <span className="inline-block w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                정확한 위치, 정보가 아닐 수 있습니다.
              </p>
              <p className="text-xs text-gray-500 flex items-center">
                <span className="inline-block w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                민간화장실일 경우 관계자의 양해를 구해주세요.
              </p>
              <p className="text-xs text-gray-500 flex items-center">
                <span className="inline-block w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                운영시간이 변경될 수 있으니 방문 전 확인하세요.
              </p>

              <p className="text-xs text-gray-500 flex items-center">
                <span className="inline-block w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                데이터 제공 :&nbsp;<a href="https://www.localdata.go.kr/lif/lifeCtacDataView.do" target="_blank" rel="noopener noreferrer" className="text-blue-500">https://www.localdata.go.kr/lif/lifeCtacDataView.do</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
