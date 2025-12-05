import { create } from 'zustand';
import zukeeper from 'zukeeper';
import { supabase } from '../lib/supabaseClient';
import { loadNaverMap } from '../utils/naverMapLoader';

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

        if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
            throw new Error("현재 좌표가 설정되지 않았습니다.");
        }

        try {
            set({ isLoadingToiletList: true, isLoadingGlobal: page === 1 });

            const limit = 10;
            const params = {
                point: `SRID=4326;POINT(${lng} ${lat})`,
                page: page,
                limit_count: limit
            };

            const { data, error } = await supabase.rpc('get_nearest_locations', params);

            if (error) {
                throw error;
            }

            const newData = data;
            const hasMore = newData.length === limit;

            set({
                // 1페이지를 불러오는 시도는 다 없애고 새거 10개만
                toilets: page === 1 ? newData : [...toilets, ...newData],
                currentPage: page,
                hasMoreData: hasMore,
                isLoadingToiletList: false,
                isLoadingGlobal: false
            });

            if (page === 1) {
                set({ selectedToilet: null });
            }

        } catch (error) {
            console.error('Error fetching toilets:', error);
            set({ isLoadingToiletList: false, hasMoreData: false, isLoadingGlobal: false });
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
            // await loadNaverMap();

            if (!window.naver.maps.Service) {
                throw new Error('Naver Maps Geocoder module is not loaded.');
            }

            return new Promise((resolve, reject) => {
                window.naver.maps.Service.geocode({
                    query: address
                }, async function (status, response) {
                    if (status !== window.naver.maps.Service.Status.OK) {
                        set({ isLoadingGlobal: false });
                        reject(new Error('주소를 찾을 수 없습니다.'));
                        return;
                    }

                    const result = response.v2;
                    if (result.addresses.length > 0) {
                        const { x, y } = result.addresses[0];
                        const location = { lat: parseFloat(y), lng: parseFloat(x) };

                        set({ location });
                        set({ address });
                        set({ selectedToilet: null });

                        try {
                            await get().getToilets(1);
                            resolve(location);
                        } catch (e) {
                            reject(e);
                        }
                    } else {
                        set({ isLoadingGlobal: false });
                        reject(new Error('주소 결과가 없습니다.'));
                    }
                });
            });

        } catch (error) {
            set({ isLoadingGlobal: false });
            console.error('주소 좌표 변환 오류:', error);
            throw new Error('주소 좌표 변환 오류: ' + error.message, { cause: error });
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
            try {
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

                            switch (error.code) {
                                case error.PERMISSION_DENIED:
                                    errorMessage = '위치 정보 접근 권한이 거부되었습니다.';
                                    break;
                                case error.POSITION_UNAVAILABLE:
                                    errorMessage = '현재 위치를 확인할 수 없습니다.';
                                    break;
                                case error.TIMEOUT:
                                    errorMessage = '위치 정보 요청 시간이 초과되었습니다.';
                                    break;
                            }

                            // 화면에 오류 메시지 표시
                            alert(errorMessage);
                            console.error('위치 정보 오류:', error.message, error.code);
                            reject(error);
                        }
                    );
                });
            } catch (e) {
                set({ isLoadingGlobal: false });
                return;
            }
        }

        // 좌표가 확보된 후에만 API 호출 진행
        if (lat && lng) {
            try {
                // await loadNaverMap();

                if (!window.naver.maps.Service) {
                    throw new Error('Naver Maps Geocoder module is not loaded.');
                }

                return new Promise((resolve, reject) => {
                    window.naver.maps.Service.reverseGeocode({
                        coords: new window.naver.maps.LatLng(lat, lng),
                        orders: [
                            window.naver.maps.Service.OrderType.ADDR,
                            window.naver.maps.Service.OrderType.ROAD_ADDR
                        ].join(',')
                    }, async function (status, response) {
                        if (status !== window.naver.maps.Service.Status.OK) {
                            set({ isLoadingGlobal: false });
                            reject(new Error('주소를 변환할 수 없습니다.'));
                            return;
                        }

                        const result = response.v2;
                        let address = '';

                        if (result.address) {
                            address = result.address.jibunAddress;
                        } else if (result.results && result.results.length > 0) {
                            // 결과 구조에 따라 파싱 (region 등 조합)
                            const region = result.results[0].region;
                            address = `${region.area1.name} ${region.area2.name} ${region.area3.name} ${region.area4.name}`.trim();
                        }

                        set({ address, location: { lat, lng } });

                        try {
                            await get().getToilets(1);
                            resolve();
                        } catch (e) {
                            reject(e);
                        }
                    });
                });

            } catch (error) {
                set({ isLoadingGlobal: false });
                throw error;
            }

        } else {
            set({ isLoadingGlobal: false });
            throw new Error('좌표 정보를 가져올 수 없습니다.');
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

                        switch (error.code) {
                            case error.PERMISSION_DENIED:
                                errorMessage = '위치 정보 접근 권한이 거부되었습니다.';
                                break;
                            case error.POSITION_UNAVAILABLE:
                                errorMessage = '현재 위치를 확인할 수 없습니다.';
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

            // await loadNaverMap();

            if (!window.naver.maps.Service) {
                throw new Error('Naver Maps Geocoder module is not loaded.');
            }

            return new Promise((resolve, reject) => {
                window.naver.maps.Service.reverseGeocode({
                    coords: new window.naver.maps.LatLng(lat, lng),
                    orders: [
                        window.naver.maps.Service.OrderType.ADDR,
                        window.naver.maps.Service.OrderType.ROAD_ADDR
                    ].join(',')
                }, async function (status, response) {
                    if (status !== window.naver.maps.Service.Status.OK) {
                        set({ isLoadingGlobal: false });
                        reject(new Error('주소를 변환할 수 없습니다.'));
                        return;
                    }

                    const result = response.v2;
                    let address = '';

                    if (result.address) {
                        address = result.address.jibunAddress;
                    } else if (result.results && result.results.length > 0) {
                        const region = result.results[0].region;
                        address = `${region.area1.name} ${region.area2.name} ${region.area3.name} ${region.area4.name}`.trim();
                    }

                    // 상태 업데이트
                    set({
                        location: { lat, lng },
                        address: address,
                        selectedToilet: null
                    });
                    set({ isLoadingGlobal: false });

                    try {
                        await get().getToilets(1);
                        resolve({ address });
                    } catch (e) {
                        reject(e);
                    }
                });
            });

        } catch (error) {
            set({ isLoadingGlobal: false });
            throw error;
        }
    },

    getToiletDetail: async (id) => {

        set({ isLoadingGlobal: true });

        try {
            const { data, error } = await supabase.rpc('get_toilet_details', { toilet_id: id });

            if (error) {
                throw error;
            }

            const toiletData = data && data.length > 0 ? data[0] : null;

            set({ selectedToilet: toiletData });
            set({ isLoadingGlobal: false });

            return { data: toiletData };
        } catch (error) {
            console.error('Error fetching toilet details:', error);
            set({ isLoadingGlobal: false });
            throw error;
        }
    }
})));


window.useToiletStore = useToiletStore;

export default useToiletStore;