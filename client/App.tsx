import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from 'react-router-dom';

//import routes
import Home from './Routes/Home';
// import Login from './Routes/Login';
import Dashboard from './Components/Dashboard/Dashboard';
import ClusterView from './Routes/ClusterView';
import SetUp from './Routes/SetUp';

//import loaders
import * as loaders from './context/loaders';
// import React from 'react';

//create router to pass into router provider component returned from app. createBrowserRouter recommended for all latest React Router web projects.
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Home />} loader={loaders.userLoader} id='home'>
      <Route path=':id' element={<Dashboard />} />
      {/* <Route path='login' element={<Login />} /> */}
      <Route
        path='clusterview'
        element={<ClusterView />}
        loader={loaders.clusterLoader}
        id='cluster'
      />
      <Route path='setup' element={<SetUp />} />
    </Route>,
  ),
);

//provide router to application
const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
