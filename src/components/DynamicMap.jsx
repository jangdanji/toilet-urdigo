import { useEffect, useRef } from 'react';

function DynamicMap({ lat, lng }) {
  const mapRef = useRef(null);
  
  useEffect(() => {
    if (!lat || !lng) {
        alert('화장실 ID가 없습니다.')
        return;
    }
    const script = document.createElement('script');
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${import.meta.env.VITE_NAVER_MAP_ID}`;
    script.async = true;
    script.onload = () => {
        if (window.naver && mapRef.current) {
          const mapOptions = {
            center: new window.naver.maps.LatLng(lat, lng),
            zoom: 18
          };
          const map = new window.naver.maps.Map(mapRef.current, mapOptions);
          
          // 커스텀 마커 구현
          const position = new window.naver.maps.LatLng(lat, lng);
          const markerOptions = {
            position: position,
            map: map,
            icon: {
              content: `
                <div class="marker-bounce">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#4F46E5" width="48" height="48" style="filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                </div>
              `,
              anchor: new window.naver.maps.Point(24, 48)
            }
          };
          
          // 마커 생성
          new window.naver.maps.Marker(markerOptions);
        }
    };

    document.head.appendChild(script);
    
    return () => {
      document.head.removeChild(script);
    };
  }, [lat, lng]);
  
  return <div ref={mapRef} id="map" className='w-full h-full' />;
}

export default DynamicMap;