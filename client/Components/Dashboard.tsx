import React, { useContext, useEffect } from 'react';
import { StoreContext } from '../stateStore';
import MetricDisplay from './MetricDisplay';
import { MetricProps, UserData } from '../types';
import { useRouteLoaderData, useParams } from 'react-router-dom';

const Dashboard = () => {
  const userData = useRouteLoaderData('home') as UserData;
  const { id } = useParams();
  //   const { currentDashboard, currentMetrics, setCurrentMetrics }: any =
  //     useContext(StoreContext);

  //   console.log('in dashboard component', currentDashboard);

  //   useEffect(() => {
  //     const metricIds: string[] = currentDashboard.metrics;
  //     console.log('here are the ids', metricIds);
  //     setCurrentMetrics(metricIds);
  //   }, []);

  const metricIds = Object.keys(userData.metrics);
  console.log('in dashboard', id);
  return (
    <div className='dashboard-outer'>
      {userData && id && metricIds && (
        <>
          <h2 className='dashboard-title'>
            {userData.dashboards[id].dashboardName}
          </h2>
          <div className='dashboard-container'>
            {metricIds.map(metricId => (
              <MetricDisplay metricId={metricId} key={metricId} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
//<h2 className='dashboard-title'>{currentDashboard.dashboardName}</h2>
{
  /* {currentMetrics.map(metricId => (
                <MetricDisplay metricId={metricId} key={metricId} />
              ))} */
}
