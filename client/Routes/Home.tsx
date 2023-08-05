import React, { useContext, useEffect, useState } from 'react';
//import { StoreContext } from '../routes/dataStore.js';
import Dashboard from '../Components/Dashboard';
import StatusBar from '../Components/StatusBar';
import NavBar from '../Components/NavBar';

const Home = () => {
  return (
    <>
      <h1>Hello World!</h1>
      <StatusBar />
      <Dashboard />
      <NavBar />
    </>
  );
};

export default Home;
