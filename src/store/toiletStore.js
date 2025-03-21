import { create } from 'zustand';

const useToiletStore = create((set) => ({

    // 위도, 경도
    location: { lat: null, lng: null },

    // 주소
    address: null,
    
    // 화장실 관련 상태
    toilets: [], // 프론트 단에 저장된 화장실 목록
    recentToilet: [], // 최근 확인한 화장실
    
    // 액션/메서드들...

    setLocation: async (lat, lng) => set({ location: { lat, lng }}),
    setAddress: (address) => set({ address }),
    resetLocation: () => set({ location: { lat: null, lng: null }, address: null }),

    setRecentToilet: (toiletId) => {
        set({ recentToilet: toiletId });
    },

    getToilets: async (page = 1) => {

        const { location } = get();
        const { lat, lng } = location;

        if (!lat || !lng) {
            console.log("좌표가 설정되지 않았습니다.");
            return;
        };

        console.log("lat, lng : ", lat, lng);

        const param = {
            lat,
            lng,
            page,
            limit: 10
        };

        const queryString = new URLSearchParams(param).toString();
        const response = await fetch(`/.netlify/functions/getToilets?${queryString}`);

        if (!response.ok) {
            console.error('Toilets error:', response);
            return;
        }
        const data = await response.json();
        set({ toilets: data.data });
    },

    resetToilets: () => set({ toilets: [] }),

    // 주소 -> 좌표
    getGeocode: async (address) => {
        const response = await fetch(`/.netlify/functions/getGeocode?address=${address}`);

        if (!response.ok) {
            console.error('Geocode error:', response);
            return { lat: null, lng: null };
        }
        const data = await response.json();

        return { lat: data.addresses[0].y, lng: data.addresses[0].x };
    },


    // 좌표 -> 주소
    getReverseGeocode: async (lat, lng) => {
        const response = await fetch(`/.netlify/functions/getReverseGeocode?lat=${lat}&lng=${lng}`);

        if (!response.ok) {
            console.error('Reverse Geocode error:', response);
            return { address: null };
        }
        const data = await response.json();
        const result = data.results[0];
        const address = data.results[0].address;
        return { address };
    }
}));

export default useToiletStore;