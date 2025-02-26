import { Link, Outlet } from 'react-router-dom'

export default function Root() {
  return (
    <>
      {/* <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
        </ul>
      </nav> */}
      
      <main className='bg-gray-100 flex items-center justify-center min-h-screen'>
        <Outlet />
      </main>
    </>
  )
}
