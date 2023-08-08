import { NavLink, Outlet } from "react-router-dom";

export default function HomeLayout () {
    return (
      <div className='home-layout'>
      <h2>Your Dashboards</h2>
  {/*where to output child components. can just be in a div if you want to reuse this format and make more layout components. i think this effectively keeps the nav at the top of the page and that is its purpose*/ }
          <Outlet/>
      </div>
    );
  };