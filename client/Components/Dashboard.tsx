import React, { useEffect, useState } from 'react';
import { Modal } from 'react-responsive-modal';
import MetricDisplay from './MetricDisplay';
import { MetricProps, UserData } from '../../types';
import {
  useRouteLoaderData,
  useParams,
  Outlet,
  useLocation,
} from 'react-router-dom';
import AlertBar from './AlertBar';
import AddMetric from './AddMetric';
import HPADashboard from './HPADashboard';

const Dashboard = () => {
  const userData = useRouteLoaderData('home') as UserData;
  // id represents the index of the dahsboard metrics stored in the user's data
  const { id } = useParams();

  const [lastUpdate, setLastUpdate] = useState<Date>();
  const [addMetricModal, setAddMetricModal] = useState(false);

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
  console.log(id === '1');

  // metric display type
  // render the HPA Test/Monitoring layout for that dashboard. Render the default metric dahsboard layout for all others
  const displayType =
    id === '1' ? (
      <div className='dashboard-container'>
        <HPADashboard />
      </div>
    ) : (
      <div className='dashboard-container'>
        {metricIds.map(metricId => (
          <MetricDisplay metricId={metricId} key={metricId + lastUpdate} />
        ))}
        <Outlet />
      </div>
    );
  console.log('displayType', id, displayType);

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
              <button className='btn' onClick={refresh}>
                Refresh
              </button>
            </span>
            <span>
              <button className='btn' onClick={pithy}>
                Pithy Loop
              </button>
            </span>
            <span>
              <button className='btn' onClick={() => setAddMetricModal(true)}>
                Add Metric
              </button>
            </span>
          </div>
          {displayType}
          <div>
            <p>Last updated: {`${lastUpdate}`}</p>
          </div>
        </>
      )}
      <div className='modal'>
        <Modal open={addMetricModal} onClose={() => setAddMetricModal(false)}>
          <AddMetric
            dashboard={location}
            setAddMetricModal={setAddMetricModal}
          />
        </Modal>
      </div>
    </div>
  );
};

export default Dashboard;
