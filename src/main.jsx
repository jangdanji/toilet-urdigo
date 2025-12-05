import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import './styles/animations.css'
import App from './App.jsx'
import { initNaverMap } from './utils/naverMapLoader'

// 앱 시작 시 네이버 지도 SDK 미리 로드
initNaverMap();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
)
