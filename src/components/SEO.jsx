import { Helmet } from 'react-helmet-async';

/**
 * 메인 페이지(ToiletList)용 SEO 컴포넌트
 */
export const ToiletListSEO = () => {
  return (
    <Helmet>
      <title>화장실어디고 | 내 주변 화장실 찾기</title>
      <meta 
        name="description" 
        content="주변 화장실을 빠르게 찾을 수 있는 서비스입니다." 
      />
      <meta name="keywords" content="화장실 찾기, 공중화장실, 화장실 위치, 화장실 지도, 근처 화장실, 서울 화장실" />
      
      <link rel="canonical" href="https://toilet-urdigo.netlify.app/" />
      
      {/* 오픈 그래프 태그 */}
      <meta property="og:title" content="화장실어디고 | 내 주변 화장실 찾기" />
      <meta 
        property="og:description" 
        content="가까운 화장실을 빠르게 찾을 수 있는 서비스입니다." 
      />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://toilet-urdigo.netlify.app/" />
      <meta property="og:image" content="https://toilet-urdigo.netlify.app/og-image.png" />
      
      {/* 트위터 카드 */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="화장실어디고 | 내 주변 화장실 찾기" />
      <meta 
        name="twitter:description" 
        content="가까운 화장실을 빠르게 찾을 수 있는 서비스입니다." 
      />
    </Helmet>
  );
};

/**
 * 화장실 상세 정보 페이지(Detail)용 SEO 컴포넌트
 */
export const DetailSEO = ({ selectedToilet, id }) => {
  if (!selectedToilet) {
    return (
      <Helmet>
        <title>화장실 정보 | 화장실어디고</title>
        <meta name="description" content="화장실 상세 정보를 확인하세요." />
      </Helmet>
    );
  }
  
  return (
    <Helmet>
      <title>{selectedToilet.name} | 화장실 위치</title>
      <meta name="description" content="화장실 상세 정보" />
      <meta name="keywords" content={`${selectedToilet.name}, 화장실 정보, 공중화장실`} />
      
      {/* 오픈 그래프 태그 */}
      <meta property="og:title" content={`${selectedToilet.name} | 화장실 위치`} />
      <meta property="og:description" content="화장실 상세 정보" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`https://toilet-urdigo.netlify.app/detail/${id}`} />
      <meta property="og:image" content="https://toilet-urdigo.netlify.app/og-image.png" />
      
      {/* 트위터 카드 */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={`${selectedToilet.name} | 화장실 위치`} />
      <meta name="twitter:description" content={`${selectedToilet.name} 상세 정보`} />
    </Helmet>
  );
};

/**
 * 화장실 지도 보기 페이지(MapView)용 SEO 컴포넌트
 */
export const MapViewSEO = ({ selectedToilet, id }) => {
  if (!selectedToilet) {
    return (
      <Helmet>
        <title>화장실 위치 | 화장실어디고</title>
        <meta name="description" content="화장실 위치를 지도에서 확인하세요." />
      </Helmet>
    );
  }
  
  return (
    <Helmet>
      <title>{`${selectedToilet.name} | 화장실 위치`}</title>
      <meta name="description" content={`${selectedToilet.name} 지도를 확인하세요.`} />
      <meta name="keywords" content={`${selectedToilet.name}, 화장실 위치, 화장실 지도`} />
      
      {/* 오픈 그래프 태그 */}
      <meta property="og:title" content={`${selectedToilet.name} | 화장실 위치`} />
      <meta property="og:description" content={`${selectedToilet.name} 지도를 확인하세요.`} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`https://toilet-urdigo.netlify.app/map/${id}`} />
      <meta property="og:image" content="https://toilet-urdigo.netlify.app/og-image.png" />
      
      {/* 트위터 카드 */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={`${selectedToilet.name} | 화장실 위치`} />
      <meta name="twitter:description" content={`${selectedToilet.name} 지도를 확인하세요.`} />
    </Helmet>
  );
};
