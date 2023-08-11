import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  useLocation,
} from 'react-router-dom';

//import layouts
import Home from '../Layouts/Home';

//pages & components
import Login from './Login';
import Settings from './Settings';
import Dashboard from '../Components/Dashboard';
import { Modal } from '../Components/MetricDisplay';

//import loaders
import * as loaders from '../Loaders';

// const location = useLocation();
// const background: any = location.state && location.state.background;

//create router to pass into router provider component returned from app. createBrowserRouter recommended for all latest React Router web projects.
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Home />} loader={loaders.userLoader} id='home'>
      <Route path=':id' element={<Dashboard />} />

      <Route path='login' element={<Login />} />
      <Route path='settings' element={<Settings />} />
    </Route>,
  ),
);

//provide router to application
const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
