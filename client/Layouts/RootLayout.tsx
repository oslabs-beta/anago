import { NavLink, Outlet } from "react-router-dom";

export default function RootLayout () {
    return (
      <div className='root-layout'>
        <header>
          {/* <nav>
            <h1>anago</h1>
            <img src='' alt='logo' />
            <NavLink to={'/login'}>Log Out</NavLink>
            <NavLink to={'/home'}>Dashboard</NavLink>
            <NavLink to={'/settings'}>Settings</NavLink>
          </nav> */}
        </header>
  {/*where to output child components. can just be in a div if you want to reuse this format and make more layout components. i think this effectively keeps the nav at the top of the page and that is its purpose*/ }
        <main>
          <Outlet/>
        </main>
      </div>
    );
  };