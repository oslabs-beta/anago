import React, { useContext, useEffect, useState } from 'react';
import Dashboard from '../Components/Dashboard';
import StatusBar from '../Components/StatusBar';
import NavBar from '../Components/NavBar';
import { StoreContext } from '../stateStore';

const Home = () => {
  const { currentMetrics, setCurrentMetrics }: any = useContext(StoreContext);
  const [heading, setHeading] = useState('Does the server work?');
  const handleClick = () => {
    console.log(
      'current metrics type: ',
      typeof currentMetrics,
      'currentMetrics:',
      currentMetrics
    );
    if (heading === 'Server works!') {
      return setHeading('Does the server work?');
    }
    fetch('/api/user', {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((res) => {
        setCurrentMetrics(res.dashboards[0].metrics);
        setHeading('Server works!');
        console.log('Got some data:', res.dashboards[0].metrics);
      })
      .catch((err) => console.log(err));
  };

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
