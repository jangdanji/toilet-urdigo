let naverMapPromise = null;

/**
 * 앱 시작 시 호출하여 네이버 지도 SDK를 미리 로드합니다.
 * main.jsx에서 한 번만 호출됩니다.
 */
export const initNaverMap = () => {
    if (naverMapPromise) return naverMapPromise;

    console.log('🔍 Initializing Naver Map SDK...');

    const clientId = import.meta.env.VITE_NAVER_MAP_ID;

    if (!clientId) {
        console.error('❌ VITE_NAVER_MAP_ID is not defined in environment variables');
        naverMapPromise = Promise.reject(new Error('VITE_NAVER_MAP_ID is not defined'));
        return naverMapPromise;
    }

    naverMapPromise = new Promise((resolve, reject) => {
        // 이미 로드된 경우
        if (window.naver && window.naver.maps) {
            console.log('✅ Naver Maps SDK already loaded');
            resolve(window.naver.maps);
            return;
        }

        const script = document.createElement('script');
        script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}&submodules=geocoder`;
        script.async = true;

        script.onload = () => {
            if (window.naver && window.naver.maps) {
                console.log('✅ Naver Maps SDK loaded');
                if (window.naver.maps.Service) {
                    console.log('✅ Naver Maps Service (Geocoder) loaded');
                }
                resolve(window.naver.maps);
            } else {
                reject(new Error('Naver Maps SDK failed to load'));
            }
        };

        script.onerror = () => reject(new Error('Failed to load Naver Maps script'));
        document.head.appendChild(script);
    });

    return naverMapPromise;
};

/**
 * 네이버 지도 SDK가 로드될 때까지 대기합니다.
 * 컴포넌트에서 SDK가 필요할 때 호출합니다.
 */
export const loadNaverMap = () => {
    if (!naverMapPromise) {
        // initNaverMap이 호출되지 않은 경우, 자동으로 초기화
        return initNaverMap();
    }
    return naverMapPromise;
};
