import React, { useContext, useEffect, useState } from 'react';
import Dashboard from '../Components/Dashboard';
import StatusBar from '../Components/StatusBar';
import NavBar from '../Components/NavBar';

import { StoreContext } from '../stateStore';
import userData from '../../server/models/defaultUserData';

const Home = () => {
  const {
    hasFetchedUserData,
    setHasFetchedUserData,
    currentDashboard,
    setCurrentDashboard,
    currentUser,
    setCurrentUser,
  }: any = useContext(StoreContext);

  const [heading, setHeading] = useState('Does the server work?');
  const handleClick = () => {
    if (heading === 'Server works!') {
      return setHeading('Does the server work?');
    }
    fetch('/api/user', {
      method: 'GET',
    })
      .then(res => res.json())
      .then(res => {
        setHeading('Server works!');
        //console.log(res);
      })
      .catch(err => console.log(err));
  };

  useEffect(() => {
    fetch('/api/user', {
      method: 'GET',
    })
      .then(res => res.json())
      .then(userData => {
        setCurrentUser(userData);
        setHasFetchedUserData(true);
        setCurrentDashboard(userData.dashboards[0]);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  //test useEffect fetch
  console.log('in the body', currentUser);
  console.log('in the body', currentDashboard);
  console.log(hasFetchedUserData);





  return (
    <>
      <h1>{heading}</h1>
      <button onClick={handleClick}>Test Server</button>
      <StatusBar />
      <Dashboard />
      <NavBar />
    </>
  );
};

export default Home;
