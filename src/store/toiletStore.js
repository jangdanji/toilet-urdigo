import { create } from 'zustand';
import zukeeper from 'zukeeper';

const useToiletStore = create(zukeeper((set, get) => ({

    // 위도, 경도
    location: { lat: null, lng: null },
    
    // 주소
    address: null,
    
    // 화장실 관련 상태
    toilets: [], // 프론트 단에 저장된 화장실 목록
    selectedToilet: {
        id: null,
        name: null,
        address: null,
        lat: null,
        lng: null,
        management: null,
        tel: null
    }, // 선택된 화장실
    
    // 페이지네이션 상태
    currentPage: 1, // 현재 페이지
    hasMoreData: true, // 더 불러올 데이터가 있는지 여부

    isLoadingGlobal: false,
    isLoadingToiletList: false, // only 화장실 리스트 로딩 중인지 여부
    
    // 액션/메서드들...

    // 선택된 화장실 설정
    setSelectedToilet: (toilet) => {
        console.log('🔍 setSelectedToilet 호출:', toilet);
        set({ selectedToilet: toilet });
    },

    // 화장실 데이터 가져오기
    getToilets: async (page = 1) => {

        const { location, toilets } = get();
        const { lat, lng } = location;

        console.log('🔍 화장실 데이터 fetch : getToilets (page : ', page, ')');

        if (!lat || !lng|| isNaN(lat) || isNaN(lng)) {
            throw new Error("현재 좌표가 설정되지 않았습니다.");
        }

        try {
            set({ isLoadingToiletList: true });

            const limit = 10;
            const param = {
                lat,
                lng,
                page,
                limit
            };

            const queryString = new URLSearchParams(param).toString();
            
            const response = await fetch(`/.netlify/functions/getToilets?${queryString}`);
            const responseData = await response.json();
            const newData = responseData.data;
            const pagination = responseData.pagination || { hasMore: newData.length === limit };

            set({ 
                // 1페이지를 불러오는 시도는 다 없애고 새거 10개만
                toilets: page === 1 ? newData : [...toilets, ...newData], 
                currentPage: page,
                hasMoreData: pagination.hasMore,
                isLoadingToiletList: false
            });

            if (page === 1) {
                set({ selectedToilet: null });
            }

        } catch (error) {
            set({ isLoadingToiletList: false, hasMoreData: false });
            throw error;
        }
    },

    // resetToilets: () => {
    //     console.log('🔍 resetToilets 호출');
    //     set({ 
    //         toilets: [],
    //         selectedToilet: null,
    //         currentPage: 1,
    //         hasMoreData: true,
    //         isLoadingToiletList: false
    //     });
    // },

    // 검색창에 자동완성 주소 클릭
    setLocationByAddress: async (address) => {
        console.log('🔍 주소 클릭 : setLocationByAddress (', address, ')');
        set({ isLoadingGlobal: true });

        try {
            const response = await fetch(`/.netlify/functions/getGeocode?address=${address}`);
            const data = await response.json();

            if (data && data.addresses && data.addresses.length > 0) {
                const result = { lat: data.addresses[0].y, lng: data.addresses[0].x };

                set({ location: result })
                set({ address: address })
                set({ selectedToilet: null })
                
                await get().getToilets(1);
                set({ isLoadingGlobal: false });
                return result;
            } else {
                set({ isLoadingGlobal: false });
                throw new Error('주소 정보를 찾을 수 없습니다.');
            }

        } catch (error) {
            set({ isLoadingGlobal: false });
            throw new Error('주소 좌표 변환 오류:', error);
        }
    },

    // 현재 위치 사용하기 버튼 : 현재 위치 좌표 -> 주소 변환 후 address 업데이트
    setCurrentAddress: async () => {

        set({ isLoadingGlobal: true });
        console.log('🔍 현재 위치 사용하기 버튼 : setCurrentAddress');

        // 1. 세션스토리지에 좌표 정보가 있다면, 그 좌표를 사용하여 주소 변환 후 address 업데이트
        // 2. 세션스토리지에 좌표 정보가 없다면, navigator.geolocation로 좌표를 가져와서 주소 변환 후 address 업데이트

        let lat;
        let lng;

        const currentPosition = sessionStorage.getItem('currentPosition');

        if (currentPosition) {
            lat = JSON.parse(currentPosition).lat;
            lng = JSON.parse(currentPosition).lng;
        } else {
            await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(
                    (position) => { // 성공 콜백
                        const { latitude, longitude } = position.coords;
                        lat = latitude;
                        lng = longitude;

                        sessionStorage.setItem('currentPosition', JSON.stringify({ lat, lng }));

                        resolve();
                    },
                    (error) => {
                        let errorMessage = '위치 정보를 가져올 수 없습니다.';
                        
                        switch(error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage = '위치 정보 접근 권한이 거부되었습니다.';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMessage = '현재 위치를 확인할 수 없습니다. 위치 서비스가 켜져 있는지 확인해주세요.';
                            break;
                        case error.TIMEOUT:
                            errorMessage = '위치 정보 요청 시간이 초과되었습니다.';
                            break;
                        }

                        set({ isLoadingGlobal: false });
                        
                        // 화면에 오류 메시지 표시
                        alert(errorMessage);
                        console.error('위치 정보 오류:', error.message, error.code);
                        reject(error);
                    }
                );
            });
        }

        // 좌표가 확보된 후에만 API 호출 진행
        if (lat && lng) {
            const response = await fetch(`/.netlify/functions/getReverseGeocode?lat=${lat}&lng=${lng}`);

            if (!response.ok) {
                set({ isLoadingGlobal: false });
                throw new Error('주소 좌표 변환 오류:', response);
            }

            const data = await response.json();
            const address = data.address;

            set({ address: address, location: { lat, lng }});
            set({ isLoadingGlobal: false });

            await get().getToilets(1);

        } else {
            set({ isLoadingGlobal: false });
            throw new Error('주소 좌표 변환 오류: 좌표 정보를 가져올 수 없습니다.');
        }

    },

    // 검색창 옆 위치 버튼 : 현재 위치를 강제로 업데이트하고 주소 변환
    updateCurrentAddress: async () => {
        console.log('🔍 검색창 옆 위치 버튼 : updateCurrentAddress 호출');
        set({ isLoadingGlobal: true });

        let lat;
        let lng;

        try {
            // 세션 스토리지에 저장된 위치 정보가 있더라도 무시하고 새로 가져옴
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(
                    (position) => { // 성공 콜백
                        resolve(position);
                    },
                    (error) => { // 실패 콜백
                        let errorMessage = '위치 정보를 가져올 수 없습니다.';
                        
                        switch(error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage = '위치 정보 접근 권한이 거부되었습니다.';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMessage = '현재 위치를 확인할 수 없습니다. 위치 서비스가 켜져 있는지 확인해주세요.';
                            break;
                        case error.TIMEOUT:
                            errorMessage = '위치 정보 요청 시간이 초과되었습니다.';
                            break;
                        }
                        
                        // 화면에 오류 메시지 표시
                        alert(errorMessage);
                        console.error('위치 정보 오류:', error.message, error.code);
                        reject(error);
                    },
                    // 옵션
                    { 
                        enableHighAccuracy: true,  // 높은 정확도 요청
                        timeout: 10000,            // 10초 타임아웃
                        maximumAge: 0              // 캐시된 위치 사용 안 함
                    }
                );
            });

            // 위치 정보에서 좌표 추출
            const { latitude, longitude } = position.coords;
            lat = latitude;
            lng = longitude;

            // 세션 스토리지 업데이트
            sessionStorage.setItem('currentPosition', JSON.stringify({ lat, lng }));
            
            // 좌표로 주소 변환
            const response = await fetch(`/.netlify/functions/getReverseGeocode?lat=${lat}&lng=${lng}`);

            if (!response.ok) {
                set({ isLoadingGlobal: false });
                throw new Error('주소 좌표 변환 오류: 좌표 정보를 가져올 수 없습니다.');
            }

            const data = await response.json();
            const address = data.address;

            // 상태 업데이트
            set({ 
                location: { lat, lng },
                address: address,
                selectedToilet: null
            });
            set({ isLoadingGlobal: false });
            await get().getToilets(1);  
            return { address };
            
        } catch (error) {
            set({ isLoadingGlobal: false });
            throw error;
        }
    },

    getToiletDetail: async (id) => {

        set({ isLoadingGlobal: true });

        const response = await fetch(`/.netlify/functions/getToiletDetails?id=${id}`);
        const data = await response.json();

        set({ selectedToilet: data });
        set({ isLoadingGlobal: false });

        return { data };
    }
})));


window.useToiletStore = useToiletStore;

export default useToiletStore;