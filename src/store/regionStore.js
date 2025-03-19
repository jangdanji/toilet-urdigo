import { create } from 'zustand';

// 좌표 정보
const useRegionStore = create((set) => ({

  regions: [],

  fetchRegions: async () => {

    set({ regions: [] });
    
    try {
      const response = await fetch('/.netlify/functions/getRegions');
      const result = await response.json();
      const regions = result.data.map(region => ({
        value: region.name,
        label: region.name
      }));
      set({ regions });
    } catch (error) {
      console.error('지역 정보 로딩 오류:', error);
      set({ regions: [] });
    }
  }
}));

export default useRegionStore;
