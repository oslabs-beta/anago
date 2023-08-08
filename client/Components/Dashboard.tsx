import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Props, StoreContext } from '../stateStore';
import { Metric } from '../../server/models/userDataClass';
import MetricDisplay from './MetricDisplay';

const Dashboard = (props: Props) => {
  const { currentDashboard, currentMetrics, setCurrentMetrics }: any =
    useContext(StoreContext);

  console.log('in dashboard component', currentDashboard);

  const metricIds = [...currentDashboard.metrics];
  console.log(metricIds);

  const metrics: React.ReactNode = [];

  metricIds.forEach(metricId => {
    try {
      fetch(`/api/metrics:${metricId}`, {
        method: 'GET',
      })
        .then(data => data.json())
        .then(data => metrics.push(<MetricDisplay {...data} />));
    } catch (err) {
      console.log(err);
    }
  });
  return (
    <div>
      <h2>{currentDashboard.dashboardName}</h2>
      "I am in the dashboard"
      {metrics}
    </div>
  );
};

export default Dashboard;
