import { Link, Outlet } from 'react-router-dom'

export default function Root() {
  return (
    <>
      <main className='bg-gray-100 flex justify-center items-center min-h-screen max-w-[1920px] mx-auto text-sm md:text-base'>
        <Outlet />
      </main>
    </>
  )
}
