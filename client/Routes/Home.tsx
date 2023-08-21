import {
  NavLink,
  Outlet,
  useRouteLoaderData,
  useNavigate,
} from 'react-router-dom';
import { UserData } from '../../types.ts';
import React, { useContext, useEffect } from 'react';
import { StoreContext } from '../context/stateStore.tsx';

export default function Home() {
  const userData = useRouteLoaderData('home') as UserData;
  const navigate = useNavigate();
  const { setHasFetchedUserData, setCurrentDashboard }: any =
    useContext(StoreContext);

  const dashboards = userData.dashboards;

  //set default dashboard and route to that dashboard
  useEffect(() => {
    setHasFetchedUserData(true);
    setCurrentDashboard(dashboards[0]);
    navigate('0');
  }, []);

  return (
    <div className='home-layout'>
      <header>
        <span className='logo-container'>
          <img
            src={'client/assets/images/anago.png'}
            alt='logo'
            className='logo-image'
          />
          <h3 className='app-title'>Anago</h3>
        </span>
        <nav>
          <NavLink to={'/'} className='nav-btn'>
            Dashboards
          </NavLink>
          {/* <NavLink to={'/settings'} className='nav-btn'>
            Settings showAlerts={false}
          </NavLink> */}
          <NavLink to={'/clusterview'} className='nav-btn'>
            Cluster View
          </NavLink>
          <NavLink to={'/setup'} className='nav-btn'>
            Getting Started
          </NavLink>
          {/* <NavLink to={'/login'} className='nav-btn'>
            Log Out
          </NavLink> */}
        </nav>
      </header>
      <div className='main-body'>
        <Outlet />
      </div>
    </div>
  );
}
