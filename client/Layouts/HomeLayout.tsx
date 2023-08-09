import { NavLink, Outlet, useLoaderData } from "react-router-dom";

export default function Home () {
    const userData = useLoaderData();






    return (
      <div className='homepage'>
      
      <h2>Your Dashboards</h2>

          <Outlet/>
      </div>
    );
  };