import {
  NavLink,
  Outlet,
  useRouteLoaderData,
  useNavigate,
  redirect,
} from 'react-router-dom';
import { UserData } from '../types';
import { useContext, useEffect } from 'react';
import { StoreContext } from '../stateStore';
import Dashboard from '../Components/Dashboard';
import logo from '../assets/images/anago.png';

export default function Home() {
  const userData = useRouteLoaderData('home') as UserData;
  const navigate = useNavigate();
  const {
    hasFetchedUserData,
    setHasFetchedUserData,
    currentDashboard,
    setCurrentDashboard,
    setCurrentUser,
  }: any = useContext(StoreContext);

  const dashboards = userData.dashboards;

  useEffect(() => {
    setCurrentUser(userData);
    setHasFetchedUserData(true);
    setCurrentDashboard(dashboards[0]);
    navigate('0');
  }, []);

  console.log('has fetched', hasFetchedUserData);
  console.log('we are in home', currentDashboard);

  return (
    <div className='home-layout'>
      <header>
        <span className='logo-container'>
          <img src={logo} alt='logo' className='logo-image' />
          <h3 className='app-title'>Anago</h3>
        </span>
        <nav>
          <NavLink to={'/home'} className='nav-btn'>
            Dashboards
          </NavLink>
          <NavLink to={'/settings'} className='nav-btn'>
            Settings
          </NavLink>
          <NavLink to={'/login'} className='nav-btn'>
            Log Out
          </NavLink>
        </nav>
      </header>

      <div className='main-body'>
        <Outlet />
      </div>
    </div>
  );
}
//<Dashboard />
//{redirect('/default')}
