import { NavLink, Outlet, useLoaderData } from 'react-router-dom';

export default function Home() {
  const userData = useLoaderData();

  console.log(userData);

  return (
    <div className='home-layout'>
      <header>
        <span className='logo'>
          <h1>anago</h1>
          <img src='' alt='logo' />
        </span>
        <nav>
          <NavLink to={'/home'}>Dashboard</NavLink>
          <NavLink to={'/settings'}>Settings</NavLink>
          <NavLink to={'/login'}>Log Out</NavLink>
        </nav>
      </header>
      
      <div>
        <Outlet />
      </div>
    </div>
  );
}
