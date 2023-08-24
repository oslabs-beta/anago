import {
  NavLink,
  Outlet,
  useRouteLoaderData,
  useNavigate,
} from 'react-router-dom';
import { UserData } from '../../types';
import React, { useContext, useEffect } from 'react';
import { StoreContext } from '../context/stateStore';

export default function Home() {
  const userData = useRouteLoaderData('home') as UserData;
  const navigate = useNavigate();
  const { setHasFetchedUserData, setCurrentDashboard, setClusterData }: any =
    useContext(StoreContext);

  const dashboards = userData.dashboards;
  //set default dashboard and route to that dashboard
  useEffect(() => {
    setHasFetchedUserData(true);
    if (window.location.pathname === '/') return navigate('0');
  }, []);

  // Fetch Cluster Data
  useEffect(() => {
    fetch('api/k8s/cluster')
      .then((data) => data.json())
      .then((data) => {
        setClusterData(data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className='home-layout'>
      <header>
        <div className='logo-container'>
          <img
            src={'client/assets/images/anago.png'}
            alt='logo'
            className='logo-image'
          />
          <h3 className='app-title'>Anago</h3>
        </div>

        <nav>
          <NavLink to={'/0'} className='nav-btn'>
            Dashboard
          </NavLink>
          <NavLink to={'/1'} className='nav-btn'>
            HPA Monitor
          </NavLink>
          <NavLink to={'/clusterview'} className='nav-btn'>
            ClusterView
          </NavLink>
          <NavLink to={'/setup'} className='nav-btn'>
            Getting Started
          </NavLink>
        </nav>
      </header>

      <div className='main-body'>
        <Outlet />
      </div>
    </div>
  );
}
