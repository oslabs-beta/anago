import React, { useContext, useEffect, useState } from 'react';
import Dashboard from '../Components/Dashboard';
import StatusBar from '../Components/StatusBar';
import NavBar from '../Components/NavBar';

const Home = () => {
  const [heading, setHeading] = useState('Does the server work?');
  const handleClick = () => {
    if (heading === 'Server works!') {
      return setHeading('Does the server work?');
    }
    fetch('/api/user', {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((res) => {
        setHeading('Server works!');
        console.log(res);
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
