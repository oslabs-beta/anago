import React, { useContext, useEffect, useState } from 'react';
import { JSX } from 'react';
import { Link, useRouteLoaderData, useNavigate } from 'react-router-dom';
import { UserData } from '../types';
import { Props, StoreContext } from '../stateStore';
import { Metric } from '../../server/models/userDataClass';
import MetricDisplay from './MetricDisplay';
import metricsController from '../../server/controllers/metricsController';

const Dashboard = () => {
  const { currentDashboard, currentMetrics, setCurrentMetrics }: any =
    useContext(StoreContext);

  console.log('in dashboard component', currentDashboard);

  const metricIds: any[] = currentDashboard.metrics;

  console.log('here are the ids', metricIds);

  const metricComponents: any[] = [];

  metricIds.forEach(metricId => {
    //console.log(`/api/data/metrics/${metricId}`)
    fetch(`/api/data/metrics/${metricId}`, {
      method: 'GET',
    })
      .then(data => data.json())
      .then(data => metricComponents.push(<MetricDisplay />));
  });

  setCurrentMetdfadrics(metricComponents)
  setTimeout(() => {
    console.log('my components', metricComponents);
  }, 2000);

  return (
    <div>
      <h2>{currentDashboard.dashboarddfaName}</h2>
      {...metricComponents}
    </div>
  );
};

export default Dashboard;

//{metricComponents.length === 8 ? { ...metricComponents } : <p>Loading</p>}
