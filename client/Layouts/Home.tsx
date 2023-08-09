import {
  NavLink,
  Outlet,
  useRouteLoaderData,
  useNavigate,
} from 'react-router-dom';
import { UserData } from '../types';
import { useEffect, useContext } from 'react';
import { StoreContext } from '../stateStore';
import Dashboard from '../Components/Dashboard';

export default function Home() {
  const userData = useRouteLoaderData('home') as UserData;
  const navigate = useNavigate();
  const {
    hasFetchedUserData,
    setHasFetchedUserData,
    currentDashboard,
    setCurrentDashboard,
    currentUser,
    setCurrentUser
  }: any = useContext(StoreContext);

  const dashboards = userData.dashboards;

  setCurrentUser(userData);
  setHasFetchedUserData(true);
  setCurrentDashboard(dashboards[0])
  

  console.log('has fetched', hasFetchedUserData)
  console.log('we are in home', dashboards);


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
        <Dashboard />
        <Outlet />
      </div>
    </div>
  );
}
