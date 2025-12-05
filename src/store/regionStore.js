import { create } from 'zustand';
import { supabase } from '../lib/supabaseClient';

// 좌표 정보
const useRegionStore = create((set) => ({

  regions: [],
  isLoading: false,

  fetchRegions: async () => {

    set({ regions: [], isLoading: true });

    try {
      const { data, error } = await supabase
        .from('regions')
        .select('*');

      if (error) throw error;

      const regions = data.map(region => ({
        value: region.name,
        label: region.name
      }));
      set({ regions, isLoading: false });
    } catch (error) {
      console.error('지역 정보 로딩 오류:', error);
      set({ regions: [], isLoading: false });
    }
  }
}));

export default useRegionStore;
