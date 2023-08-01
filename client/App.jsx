import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


const App = () => {
  return (
    <Router>
      <div className='App'>
        <NavBar />
        <Routes>
          <Route path='/'>
            <Home/>
          </Route>
          <Route path='/about'>
            <About />
          </Route>
          <Route path='/'>

          </Route>
        </Routes>
      </div>
    </Router>
  );
};

export default App;