import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from 'react-router-dom';

//import routes
import Home from './Home';
import Login from './Login';
import Settings from './Settings';
import Dashboard from '../Components/Dashboard';
import ClusterView from './ClusterView';

//import loaders
import * as loaders from '../Loaders';

//create router to pass into router provider component returned from app. createBrowserRouter recommended for all latest React Router web projects.
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Home />} loader={loaders.userLoader} id='home'>
      <Route path=':id' element={<Dashboard />} />
      <Route path='login' element={<Login />} />
      <Route path='settings' element={<Settings />} />
      <Route path='clusterview' element={<ClusterView />} loader={loaders.clusterLoader}/>
    </Route>,
  ),
);

//provide router to application
const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
