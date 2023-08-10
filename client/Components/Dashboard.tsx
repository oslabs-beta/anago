import React, { useContext, useEffect } from 'react';
import { StoreContext } from '../stateStore';
import MetricDisplay from './MetricDisplay';
import { MetricProps } from '../types';

const Dashboard = () => {
  const {
    currentDashboard,
    currentMetrics,
    setCurrentMetrics,
    setLastUpdate,
    lastUpdate,
  }: any = useContext(StoreContext);

  console.log('in dashboard component', currentDashboard);

  useEffect(() => {
    const metricIds: string[] = currentDashboard.metrics;
    console.log('here are the ids', metricIds);
    setCurrentMetrics(metricIds);
    setLastUpdate(new Date());
  }, []);

  const refresh = () => {
    setLastUpdate(new Date());
  };
  const pithy = () => {
    console.log('fetch pithy');
    try {
      fetch('/api/pithy')
        .then((res) => res.json())
        .then((res) => {
          // console.log(res);
          setTimeout(() => pithy(), 1000);
        });
    } catch {
      console.log('failed to fetch pithy');
    }
  };

  return (
    <div className="dashboard-outer">
      <h2 className="dashboard-title">{currentDashboard.dashboardName}</h2>
      <div className="dashboard-buttons-container">
        <span>
          <button onClick={refresh}>Refresh</button>
        </span>
        <span>
          <button onClick={pithy}>Pithy Loop</button>
        </span>
      </div>
      <div className="dashboard-container">
        {currentMetrics.map((metricId) => (
          <MetricDisplay metricId={metricId} key={metricId + lastUpdate} />
        ))}
      </div>
      <div>
        <p>Last updated: {`${lastUpdate}`}</p>
      </div>
    </div>
  );
};

export default Dashboard;

//{metricComponents.length === 8 ? { ...metricComponents } : <p>Loading</p>}
