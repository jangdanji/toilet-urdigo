import { createBrowserRouter } from 'react-router-dom'
import Root from '../layouts/Root'
import Home from '../pages/Home'
import About from '../pages/About'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'about',
        element: <About />,
      },
    ],
  },
])
