import { createBrowserRouter } from 'react-router-dom'
import Root from '../layouts/Root'
import Detail from '../pages/Detail'
import ToiletList from '../pages/ToiletList'
import MapView from '../pages/MapView'

// GitHub Pages 배포 시 base path 설정
const basename = import.meta.env.BASE_URL;

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        index: true,
        element: <ToiletList />,
      },
      {
        path: 'map/:id',
        element: <MapView />,
      },
      {
        path: 'detail/:id',
        element: <Detail />,
      },
    ],
  },
], { basename });

