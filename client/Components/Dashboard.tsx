import React, { useContext, useEffect } from 'react';
import { StoreContext } from '../stateStore';
import MetricDisplay from './MetricDisplay';
import { MetricProps } from '../types';

const Dashboard = () => {
  const { currentDashboard, currentMetrics, setCurrentMetrics }: any =
    useContext(StoreContext);

  console.log('in dashboard component', currentDashboard);

  useEffect(() => {
    const metricIds: string[] = currentDashboard.metrics;
    console.log('here are the ids', metricIds);
    setCurrentMetrics(metricIds);
  }, []);

  return (
    <div className="dashboard-outer">
      <h2 className="dashboard-title">{currentDashboard.dashboardName}</h2>
      <div className="dashboard-container">
        {currentMetrics.map((metricId) => (
          <MetricDisplay metricId={metricId} key={metricId} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

//{metricComponents.length === 8 ? { ...metricComponents } : <p>Loading</p>}
