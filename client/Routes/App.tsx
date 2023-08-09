import React from 'react';
// import {
//   createBrowserRouter,
//   RouterProvider,
//   Routes,
//   Route,
//   useParams,
// } from 'react-router-dom';

import {
  Route,
  NavLink,
  createBrowserRouter,
  createRoutesFromElements,
  Outlet,
  RouterProvider,
} from 'react-router-dom';

//import layouts
import RootLayout from '../Layouts/Home';
import Home from '../Layouts/Home';

//pages & components
import Login from './Login';
import Settings from './Settings';
import Dashboard from '../Components/Dashboard';

//import loaders
import * as loaders from '../Loaders';

//create router to pass into router provider component returned from app. createBrowserRouter recommended for all latest React Router web projects.
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Home />} loader={loaders.userLoader}>
      <Route path =':id' element={<Dashboard />} loader={loaders.metricsLoader}/>
        

    
      

      <Route path='login' element={<Login />} />
      {/* <Route path='settings' element={<Settings />}>
        {/*can add nested children routes here, for example
        <Route path="clusters">
        <Route path="queries"> route would be /settings/queries
        would need to pass in another layout instead of settings component
       </Route> */}
      
    </Route>,
  ),
);

//provide router to application
const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
{
  /* <Route path='home' element={<HomeLayout />}>
        <Route index element = {<Home/>}/>
       // <Route path='dashboard:id' element={<Dashboard/>}></Route>
      </Route> */
}
