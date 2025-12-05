import { createBrowserRouter } from 'react-router-dom'
import Root from '../layouts/Root'
import Detail from '../pages/Detail'
import ToiletList from '../pages/ToiletList'
import MapView from '../pages/MapView'

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
]);
