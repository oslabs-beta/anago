import { useEffect, useState } from 'react';

import MetricDisplay from './MetricDisplay';
import { UserData } from '../types';
import { useRouteLoaderData, useParams, Outlet } from 'react-router-dom';
import AlertBar from './AlertBar';

const Dashboard = () => {
  const userData = useRouteLoaderData('home') as UserData;
  const { id } = useParams();

  const [lastUpdate, setLastUpdate] = useState<Date>();

  useEffect(() => {
    setLastUpdate(new Date());
  }, []);

  //pithy rendering example
  const refresh = () => setLastUpdate(new Date());
  const pithy = () => {
    console.log('fetch pithy');
    try {
      fetch('/api/pithy')
        .then(res => res.json())
        .then(res => {
          setTimeout(() => pithy(), 1000);
        });
    } catch {
      console.log('failed to fetch pithy');
    }
  };

  const metricIds = Object.keys(userData.metrics);
  console.log('in dashboard', id);
  return (
    <div className='dashboard-outer'>
      {id && (
        <>
          <h2 className='dashboard-title'>
            {userData.dashboards[id].dashboardName}
          </h2>
          <AlertBar />
          <div className='dashboard-buttons'>
            <span>
              <button onClick={refresh}>Refresh</button>
            </span>
            <span>
              <button onClick={pithy}>Pithy Loop</button>
            </span>
          </div>
          <div className='dashboard-container'>
            {metricIds.map(metricId => (
              <MetricDisplay metricId={metricId} key={metricId + lastUpdate} />
            ))}
            <Outlet />
          </div>
          <div>
            <p>Last updated: {`${lastUpdate}`}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
