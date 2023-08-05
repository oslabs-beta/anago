import React from 'react';
// import {
//   createBrowserRouter,
//   RouterProvider,
//   Routes,
//   Route,
//   useParams,
// } from 'react-router-dom';

import { BrowserRouter } from 'react-router-dom';

import Login from './Login';
import Home from './Home';

const App = () => {
  return (
    <BrowserRouter>
      <Login />
      <Home />
    </BrowserRouter>
  );
};

export default App;
